# Snapshot report for `src/storage-0.8.test.ts`

The actual snapshot is saved in `storage-0.8.test.ts.snap`.

Generated by [AVA](https://avajs.dev).

## user defined value types - extraction - 0.8.8

> Snapshot 1

    {
      baseSlot: undefined,
      namespaces: [],
      storage: [
        {
          contract: 'Storage088',
          label: 'my_user_value',
          offset: 0,
          renamedFrom: undefined,
          retypedFrom: undefined,
          slot: '0',
          src: 'file.sol:1',
          type: 't_userDefinedValueType(MyUserValueType)',
        },
      ],
      types: [
        [
          't_userDefinedValueType(MyUserValueType)',
          {
            label: 'Storage088.MyUserValueType',
            members: undefined,
            numberOfBytes: '32',
            underlying: 't_uint128',
          },
        ],
        [
          't_uint128',
          {
            label: 'uint128',
            members: undefined,
          },
        ],
      ],
    }

## user defined value types - extraction - 0.8.9

> Snapshot 1

    {
      baseSlot: undefined,
      namespaces: [],
      storage: [
        {
          contract: 'Storage089',
          label: 'my_user_value',
          offset: 0,
          renamedFrom: undefined,
          retypedFrom: undefined,
          slot: '0',
          src: 'file.sol:1',
          type: 't_userDefinedValueType(MyUserValueType)',
        },
      ],
      types: [
        [
          't_userDefinedValueType(MyUserValueType)',
          {
            label: 'Storage089.MyUserValueType',
            members: undefined,
            numberOfBytes: '16',
            underlying: 't_uint128',
          },
        ],
        [
          't_uint128',
          {
            label: 'uint128',
            members: undefined,
          },
        ],
      ],
    }

## user defined value types - no layout info

> Snapshot 1

    {
      baseSlot: undefined,
      namespaces: [],
      storage: [
        {
          contract: 'Storage089',
          label: 'my_user_value',
          renamedFrom: undefined,
          retypedFrom: undefined,
          src: 'file.sol:1',
          type: 't_userDefinedValueType(MyUserValueType)',
        },
      ],
      types: [
        [
          't_userDefinedValueType(MyUserValueType)',
          {
            label: 'Storage089.MyUserValueType',
            members: undefined,
            underlying: 't_uint128',
          },
        ],
        [
          't_uint128',
          {
            label: 'uint128',
            members: undefined,
          },
        ],
      ],
    }

## renamed retyped - extraction

> Snapshot 1

    {
      baseSlot: undefined,
      namespaces: [],
      storage: [
        {
          contract: 'StorageRenamedRetyped',
          label: 'a',
          offset: 0,
          renamedFrom: 'b',
          retypedFrom: undefined,
          slot: '0',
          src: 'file.sol:1',
          type: 't_uint256',
        },
        {
          contract: 'StorageRenamedRetyped',
          label: 'b',
          offset: 0,
          renamedFrom: undefined,
          retypedFrom: 'bool',
          slot: '1',
          src: 'file.sol:1',
          type: 't_uint8',
        },
        {
          contract: 'StorageRenamedRetyped',
          label: 'c',
          offset: 1,
          renamedFrom: 'b',
          retypedFrom: 'bool',
          slot: '1',
          src: 'file.sol:1',
          type: 't_uint8',
        },
        {
          contract: 'StorageRenamedRetyped',
          label: 'd',
          offset: 2,
          renamedFrom: 'b',
          retypedFrom: 'bool',
          slot: '1',
          src: 'file.sol:1',
          type: 't_uint8',
        },
      ],
      types: [
        [
          't_uint256',
          {
            label: 'uint256',
            members: undefined,
            numberOfBytes: '32',
          },
        ],
        [
          't_uint8',
          {
            label: 'uint8',
            members: undefined,
            numberOfBytes: '1',
          },
        ],
      ],
    }
