import { ValidationError, convertToWarnings } from './run';
import { ProxyDeployment } from '../manifest';
import { logWarning } from '../utils/log';
import { describeError } from './report';

// Backwards compatibility
export { silenceWarnings } from '../utils/log';

/**
 * Option for the kind of proxy that will be used.
 */
export interface ProxyKindOption {
  /**
   * The kind of proxy to deploy, upgrade or import, or the kind of proxy that the implementation will be used with. Defaults to `"transparent"`.
   */
  kind?: ProxyDeployment['kind'];
}

/**
 * Validation options in a standalone context (without storage layout comparisons with a previous implementation).
 */
export interface StandaloneValidationOptions extends ProxyKindOption {
  /**
   * @deprecated Equivalent to including "struct-definition" and "enum-definition" in unsafeAllow. No longer necessary.
   */
  unsafeAllowCustomTypes?: boolean;

  /**
   * @deprecated Equivalent to including `"external-library-linking"` in {@link unsafeAllow}.
   */
  unsafeAllowLinkedLibraries?: boolean;

  /**
   * Selectively disable one or more validation errors or warnings.
   */
  unsafeAllow?: ValidationError['kind'][];
}

/**
 * Validation options in the context of an upgrade (with storage layout comparisons with a previous implementation).
 */
export interface ValidationOptions extends StandaloneValidationOptions {
  /**
   * Configure storage layout check to allow variable renaming.
   */
  unsafeAllowRenames?: boolean;

  /**
   * Upgrades the proxy or beacon without first checking for storage layout compatibility errors. This is a dangerous option meant to be used as a last resort.
   */
  unsafeSkipStorageCheck?: boolean;
}

/**
 * Warnings to display when a validation error occurs but is allowed.
 * `null` indicates that the original message should be displayed.
 */
export const ValidationErrorUnsafeMessages: Record<ValidationError['kind'], string[] | null> = {
  'state-variable-assignment': [
    `You are using the \`unsafeAllow.state-variable-assignment\` flag.`,
    `The value will be stored in the implementation and not the proxy.`,
  ],
  'state-variable-immutable': [`You are using the \`unsafeAllow.state-variable-immutable\` flag.`],
  'external-library-linking': [
    `You are using the \`unsafeAllow.external-library-linking\` flag to include external libraries.`,
    `Make sure you have manually checked that the linked libraries are upgrade safe.`,
  ],
  'struct-definition': [
    `You are using the \`unsafeAllow.struct-definition\` flag to skip storage checks for structs.`,
    `Make sure you have manually checked the storage layout for incompatibilities.`,
  ],
  'enum-definition': [
    `You are using the \`unsafeAllow.enum-definition\` flag to skip storage checks for enums.`,
    `Make sure you have manually checked the storage layout for incompatibilities.`,
  ],
  constructor: [`You are using the \`unsafeAllow.constructor\` flag.`],
  delegatecall: [`You are using the \`unsafeAllow.delegatecall\` flag.`],
  selfdestruct: [`You are using the \`unsafeAllow.selfdestruct\` flag.`],
  'missing-public-upgradeto': [
    `You are using the \`unsafeAllow.missing-public-upgradeto\` flag with uups proxy.`,
    `Not having a public upgradeTo or upgradeToAndCall function in your implementation can break upgradeability.`,
    `Some implementation might check that onchain, and cause the upgrade to revert.`,
  ],
  'internal-function-storage': [
    `You are using the \`unsafeAllow.internal-function-storage\` flag.`,
    `Internal functions are code pointers which will no longer be valid after an upgrade.`,
    `Make sure you reassign internal functions in storage variables during upgrades.`,
  ],
  'missing-initializer': [
    `You are using the \`unsafeAllow.missing-initializer\` flag.`,
    `Make sure you have manually checked that the contract has an initializer and that it correctly calls all parent initializers.`,
  ],
  'missing-initializer-call': [
    `You are using the \`unsafeAllow.missing-initializer-call\` flag.`,
    `Make sure you have manually checked that the contract initializer calls all parent initializers.`,
  ],
  'duplicate-initializer-call': [
    `You are using the \`unsafeAllow.duplicate-initializer-call\` flag.`,
    `Make sure you have manually checked that the contract initializer calls each parent initializer only once.`,
  ],
  'incorrect-initializer-order': null,
};

export function withValidationDefaults(opts: ValidationOptions): Required<ValidationOptions> {
  const unsafeAllow = opts.unsafeAllow ?? [];
  const unsafeAllowCustomTypes =
    opts.unsafeAllowCustomTypes ??
    (unsafeAllow.includes('struct-definition') && unsafeAllow.includes('enum-definition'));
  const unsafeAllowLinkedLibraries =
    opts.unsafeAllowLinkedLibraries ?? unsafeAllow.includes('external-library-linking');

  if (unsafeAllowCustomTypes) {
    unsafeAllow.push('enum-definition', 'struct-definition');
  }
  if (unsafeAllowLinkedLibraries) {
    unsafeAllow.push('external-library-linking');
  }

  const kind = opts.kind ?? 'transparent';

  const unsafeAllowRenames = opts.unsafeAllowRenames ?? false;
  const unsafeSkipStorageCheck = opts.unsafeSkipStorageCheck ?? false;

  return {
    unsafeAllowCustomTypes,
    unsafeAllowLinkedLibraries,
    unsafeAllowRenames,
    unsafeSkipStorageCheck,
    unsafeAllow,
    kind,
  };
}

export function processExceptions(
  contractName: string,
  errors: ValidationError[],
  opts: ValidationOptions,
): ValidationError[] {
  const { unsafeAllow } = withValidationDefaults(opts);

  if (opts.kind === 'transparent' || opts.kind === 'beacon') {
    errors = errors.filter(error => error.kind !== 'missing-public-upgradeto');
  }

  for (const [key, errorDescription] of Object.entries(ValidationErrorUnsafeMessages)) {
    const errorType = key as ValidationError['kind'];
    const skip = unsafeAllow.includes(errorType);
    const warn = convertToWarnings.includes(errorType);

    if (skip || warn) {
      const errorsWithType = errors.filter(error => error.kind === errorType);
      errors = errors.filter(error => !errorsWithType.includes(error));

      // Display message about the exception, unless it is a warning that the user has chosen to skip
      if (errorsWithType.length > 0 && !(skip && warn)) {
        if (errorDescription !== null) {
          logWarning(`Potentially unsafe deployment of ${contractName}`, errorDescription);
        } else {
          for (const error of errorsWithType) {
            logWarning(`Potentially unsafe deployment of ${contractName}`, [describeError(error)]);
          }
        }
      }
    }
  }

  return errors;
}
