const RoyaltiesManagerABI = [
  {
    anonymous: false,
    inputs   : [
      {
        indexed     : true,
        internalType: 'address',
        name        : 'previousOwner',
        type        : 'address',
      },
      {
        indexed     : true,
        internalType: 'address',
        name        : 'newOwner',
        type        : 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs   : [
      {
        indexed     : false,
        internalType: 'address',
        name        : 'collectionAddress',
        type        : 'address',
      },
      {
        indexed     : false,
        internalType: 'address',
        name        : 'receiver',
        type        : 'address',
      },
      {
        indexed     : false,
        internalType: 'uint256',
        name        : 'feesPercentage',
        type        : 'uint256',
      },
    ],
    name: 'RoyaltiesAddressSet',
    type: 'event',
  },
  {
    inputs : [],
    name   : 'ERC2981Support',
    outputs: [
      {
        internalType: 'bool',
        name        : '',
        type        : 'bool',
      },
    ],
    stateMutability: 'view',
    type           : 'function',
    constant       : true,
  },
  {
    inputs : [],
    name   : 'owner',
    outputs: [
      {
        internalType: 'address',
        name        : '',
        type        : 'address',
      },
    ],
    stateMutability: 'view',
    type           : 'function',
    constant       : true,
  },
  {
    inputs         : [],
    name           : 'renounceOwnership',
    outputs        : [],
    stateMutability: 'nonpayable',
    type           : 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name        : 'newOwner',
        type        : 'address',
      },
    ],
    name           : 'transferOwnership',
    outputs        : [],
    stateMutability: 'nonpayable',
    type           : 'function',
  },
  {
    inputs         : [],
    name           : 'toggleERC2981Support',
    outputs        : [],
    stateMutability: 'nonpayable',
    type           : 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name        : 'collectionAddress',
        type        : 'address',
      },
      {
        internalType: 'address',
        name        : 'receiver',
        type        : 'address',
      },
      {
        internalType: 'uint256',
        name        : 'feesPercentage',
        type        : 'uint256',
      },
    ],
    name           : 'setRoyaltiesAddress',
    outputs        : [],
    stateMutability: 'nonpayable',
    type           : 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name        : 'collectionAddress',
        type        : 'address',
      },
      {
        internalType: 'uint256',
        name        : 'tokenId',
        type        : 'uint256',
      },
      {
        internalType: 'uint256',
        name        : 'salePrice',
        type        : 'uint256',
      },
    ],
    name   : 'getRoyalties',
    outputs: [
      {
        internalType: 'address',
        name        : 'receiver',
        type        : 'address',
      },
      {
        internalType: 'uint256',
        name        : 'royaltyAmount',
        type        : 'uint256',
      },
    ],
    stateMutability: 'view',
    type           : 'function',
    constant       : true,
  },
];

export default RoyaltiesManagerABI;
