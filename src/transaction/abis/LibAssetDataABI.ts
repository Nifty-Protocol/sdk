const LibAssetDataABI =  [
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "name": "decodeAssetProxyId",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "assetProxyId",
        "type": "bytes4"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "name": "encodeERC20AssetData",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "name": "decodeERC20AssetData",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "assetProxyId",
        "type": "bytes4"
      },
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "encodeERC721AssetData",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "name": "decodeERC721AssetData",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "assetProxyId",
        "type": "bytes4"
      },
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "tokenIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "tokenValues",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "callbackData",
        "type": "bytes"
      }
    ],
    "name": "encodeERC1155AssetData",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "name": "decodeERC1155AssetData",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "assetProxyId",
        "type": "bytes4"
      },
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "tokenIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "tokenValues",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "callbackData",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes[]",
        "name": "nestedAssetData",
        "type": "bytes[]"
      }
    ],
    "name": "encodeMultiAssetData",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "name": "decodeMultiAssetData",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "assetProxyId",
        "type": "bytes4"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes[]",
        "name": "nestedAssetData",
        "type": "bytes[]"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staticCallTargetAddress",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "staticCallData",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "expectedReturnDataHash",
        "type": "bytes32"
      }
    ],
    "name": "encodeStaticCallAssetData",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "name": "decodeStaticCallAssetData",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "assetProxyId",
        "type": "bytes4"
      },
      {
        "internalType": "address",
        "name": "staticCallTargetAddress",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "staticCallData",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "expectedReturnDataHash",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "assetData",
        "type": "bytes"
      }
    ],
    "name": "revertIfInvalidAssetData",
    "outputs": [],
    "stateMutability": "pure",
    "type": "function"
  }
]

export default LibAssetDataABI