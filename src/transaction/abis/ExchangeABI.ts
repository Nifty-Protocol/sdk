const ExchangeABI =  [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "chainId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes4",
        "name": "id",
        "type": "bytes4"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "assetProxy",
        "type": "address"
      }
    ],
    "name": "AssetProxyRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "makerAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "makerAssetData",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "takerAssetData",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "senderAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "orderHash",
        "type": "bytes32"
      }
    ],
    "name": "Cancel",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "makerAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderEpoch",
        "type": "uint256"
      }
    ],
    "name": "CancelUpTo",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "makerAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "royaltiesAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "makerAssetData",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "takerAssetData",
        "type": "bytes"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "orderHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "takerAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "senderAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "makerAssetAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "takerAssetAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "royaltiesAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "protocolFeePaid",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "marketplaceIdentifier",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "marketplaceFeePaid",
        "type": "uint256"
      }
    ],
    "name": "Fill",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "identifier",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "feeMultiplier",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "feeCollector",
        "type": "address"
      }
    ],
    "name": "MarketplaceRegister",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "identifier",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "feeMultiplier",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "feeCollector",
        "type": "address"
      }
    ],
    "name": "MarketplaceSetFees",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "identifier",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "status",
        "type": "bool"
      }
    ],
    "name": "MarketplaceUpdateStatus",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "oldProtocolFeeCollector",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "updatedProtocolFeeCollector",
        "type": "address"
      }
    ],
    "name": "ProtocolFeeCollectorAddress",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "oldProtocolFeeMultiplier",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "updatedProtocolFeeMultiplier",
        "type": "uint256"
      }
    ],
    "name": "ProtocolFeeMultiplier",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "oldProtocolFixedFee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "updatedProtocolFixedFee",
        "type": "uint256"
      }
    ],
    "name": "ProtocolFixedFee",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DOMAIN_HASH",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "cancelled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "detachProtocolFeeCollector",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "distributeMarketplaceFees",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "filled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "assetProxyId",
        "type": "bytes4"
      }
    ],
    "name": "getAssetProxy",
    "outputs": [
      {
        "internalType": "address",
        "name": "assetProxy",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "signerAddress",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "isValidHashSignature",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "makerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "takerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "royaltiesAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "senderAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "makerAssetAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerAssetAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "royaltiesAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "expirationTimeSeconds",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "makerAssetData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "takerAssetData",
            "type": "bytes"
          }
        ],
        "internalType": "struct LibOrder.Order",
        "name": "order",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "isValidOrderSignature",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_distributeMarketplaceFees",
        "type": "bool"
      }
    ],
    "name": "marketplaceDistribution",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "orderEpoch",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolFeeCollector",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolFeeMultiplier",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolFixedFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "assetProxy",
        "type": "address"
      }
    ],
    "name": "registerAssetProxy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "identifier",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "feeMultiplier",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "feeCollector",
        "type": "address"
      }
    ],
    "name": "registerMarketplace",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "identifier",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "feeMultiplier",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "feeCollector",
        "type": "address"
      }
    ],
    "name": "setMarketplaceFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "identifier",
        "type": "bytes32"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "name": "setMarketplaceStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "updatedProtocolFeeCollector",
        "type": "address"
      }
    ],
    "name": "setProtocolFeeCollectorAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "updatedProtocolFeeMultiplier",
        "type": "uint256"
      }
    ],
    "name": "setProtocolFeeMultiplier",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "updatedProtocolFixedFee",
        "type": "uint256"
      }
    ],
    "name": "setProtocolFixedFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "makerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "takerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "royaltiesAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "senderAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "makerAssetAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerAssetAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "royaltiesAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "expirationTimeSeconds",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "makerAssetData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "takerAssetData",
            "type": "bytes"
          }
        ],
        "internalType": "struct LibOrder.Order",
        "name": "order",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "marketplaceIdentifier",
        "type": "bytes32"
      }
    ],
    "name": "fillOrder",
    "outputs": [
      {
        "internalType": "bool",
        "name": "fulfilled",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "makerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "takerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "royaltiesAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "senderAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "makerAssetAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerAssetAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "royaltiesAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "expirationTimeSeconds",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "makerAssetData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "takerAssetData",
            "type": "bytes"
          }
        ],
        "internalType": "struct LibOrder.Order",
        "name": "order",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "marketplaceIdentifier",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "takerAddress",
        "type": "address"
      }
    ],
    "name": "fillOrderFor",
    "outputs": [
      {
        "internalType": "bool",
        "name": "fulfilled",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "makerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "takerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "royaltiesAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "senderAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "makerAssetAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerAssetAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "royaltiesAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "expirationTimeSeconds",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "makerAssetData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "takerAssetData",
            "type": "bytes"
          }
        ],
        "internalType": "struct LibOrder.Order",
        "name": "order",
        "type": "tuple"
      }
    ],
    "name": "cancelOrder",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "targetOrderEpoch",
        "type": "uint256"
      }
    ],
    "name": "cancelOrdersUpTo",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "makerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "takerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "royaltiesAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "senderAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "makerAssetAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerAssetAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "royaltiesAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "expirationTimeSeconds",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "makerAssetData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "takerAssetData",
            "type": "bytes"
          }
        ],
        "internalType": "struct LibOrder.Order",
        "name": "order",
        "type": "tuple"
      }
    ],
    "name": "getOrderInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "enum LibOrder.OrderStatus",
            "name": "orderStatus",
            "type": "uint8"
          },
          {
            "internalType": "enum LibOrder.OrderType",
            "name": "orderType",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "orderHash",
            "type": "bytes32"
          },
          {
            "internalType": "bool",
            "name": "filled",
            "type": "bool"
          }
        ],
        "internalType": "struct LibOrder.OrderInfo",
        "name": "orderInfo",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "returnAllETHToOwner",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ERC20Token",
        "type": "address"
      }
    ],
    "name": "returnERC20ToOwner",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export default ExchangeABI;
