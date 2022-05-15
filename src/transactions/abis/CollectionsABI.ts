const CollectionsABI = [
  {
    inputs         : [],
    stateMutability: 'nonpayable',
    type           : 'constructor',
  },
  {
    anonymous: false,
    inputs   : [
      {
        indexed     : false,
        internalType: 'address',
        name        : 'contractAddress',
        type        : 'address',
      },
      {
        indexed     : false,
        internalType: 'address',
        name        : 'user',
        type        : 'address',
      },
    ],
    name: 'CollectionCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs   : [
      {
        indexed     : true,
        internalType: 'bytes32',
        name        : 'role',
        type        : 'bytes32',
      },
      {
        indexed     : true,
        internalType: 'bytes32',
        name        : 'previousAdminRole',
        type        : 'bytes32',
      },
      {
        indexed     : true,
        internalType: 'bytes32',
        name        : 'newAdminRole',
        type        : 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs   : [
      {
        indexed     : true,
        internalType: 'bytes32',
        name        : 'role',
        type        : 'bytes32',
      },
      {
        indexed     : true,
        internalType: 'address',
        name        : 'account',
        type        : 'address',
      },
      {
        indexed     : true,
        internalType: 'address',
        name        : 'sender',
        type        : 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs   : [
      {
        indexed     : true,
        internalType: 'bytes32',
        name        : 'role',
        type        : 'bytes32',
      },
      {
        indexed     : true,
        internalType: 'address',
        name        : 'account',
        type        : 'address',
      },
      {
        indexed     : true,
        internalType: 'address',
        name        : 'sender',
        type        : 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name        : '',
        type        : 'address',
      },
      {
        internalType: 'uint256',
        name        : '',
        type        : 'uint256',
      },
    ],
    name   : 'CollectionsMap',
    outputs: [
      {
        internalType: 'address',
        name        : 'contractAddress',
        type        : 'address',
      },
      {
        internalType: 'string',
        name        : 'name',
        type        : 'string',
      },
      {
        internalType: 'string',
        name        : 'symbol',
        type        : 'string',
      },
      {
        internalType: 'address',
        name        : 'minter',
        type        : 'address',
      },
    ],
    stateMutability: 'view',
    type           : 'function',
  },
  {
    inputs : [],
    name   : 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name        : '',
        type        : 'bytes32',
      },
    ],
    stateMutability: 'view',
    type           : 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name        : 'role',
        type        : 'bytes32',
      },
    ],
    name   : 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name        : '',
        type        : 'bytes32',
      },
    ],
    stateMutability: 'view',
    type           : 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name        : 'role',
        type        : 'bytes32',
      },
      {
        internalType: 'address',
        name        : 'account',
        type        : 'address',
      },
    ],
    name           : 'grantRole',
    outputs        : [],
    stateMutability: 'nonpayable',
    type           : 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name        : 'role',
        type        : 'bytes32',
      },
      {
        internalType: 'address',
        name        : 'account',
        type        : 'address',
      },
    ],
    name   : 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name        : '',
        type        : 'bool',
      },
    ],
    stateMutability: 'view',
    type           : 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name        : 'role',
        type        : 'bytes32',
      },
      {
        internalType: 'address',
        name        : 'account',
        type        : 'address',
      },
    ],
    name           : 'renounceRole',
    outputs        : [],
    stateMutability: 'nonpayable',
    type           : 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name        : 'role',
        type        : 'bytes32',
      },
      {
        internalType: 'address',
        name        : 'account',
        type        : 'address',
      },
    ],
    name           : 'revokeRole',
    outputs        : [],
    stateMutability: 'nonpayable',
    type           : 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name        : 'interfaceId',
        type        : 'bytes4',
      },
    ],
    name   : 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name        : '',
        type        : 'bool',
      },
    ],
    stateMutability: 'view',
    type           : 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name        : 'contractAddress',
        type        : 'address',
      },
      {
        internalType: 'string',
        name        : 'name',
        type        : 'string',
      },
      {
        internalType: 'string',
        name        : 'symbol',
        type        : 'string',
      },
      {
        internalType: 'address',
        name        : 'owner',
        type        : 'address',
      },
    ],
    name           : 'addCollection',
    outputs        : [],
    stateMutability: 'nonpayable',
    type           : 'function',
  },
  {
    inputs : [],
    name   : 'getCollections',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name        : 'contractAddress',
            type        : 'address',
          },
          {
            internalType: 'string',
            name        : 'name',
            type        : 'string',
          },
          {
            internalType: 'string',
            name        : 'symbol',
            type        : 'string',
          },
          {
            internalType: 'address',
            name        : 'minter',
            type        : 'address',
          },
        ],
        internalType: 'struct Collections.Collection[]',
        name        : '',
        type        : 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type           : 'function',
  },
];

export default CollectionsABI;
