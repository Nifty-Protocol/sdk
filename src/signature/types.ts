export const signatureTypes = {
    types: {
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
      ],
      Order: [
        {
          name: 'makerAddress',
          type: 'address',
        },
        {
          name: 'takerAddress',
          type: 'address',
        },
        {
          name: 'feeRecipientAddress',
          type: 'address',
        },
        {
          name: 'senderAddress',
          type: 'address',
        },
        {
          name: 'makerAssetAmount',
          type: 'uint256',
        },
        {
          name: 'takerAssetAmount',
          type: 'uint256',
        },
        {
          name: 'makerFee',
          type: 'uint256',
        },
        {
          name: 'takerFee',
          type: 'uint256',
        },
        {
          name: 'expirationTimeSeconds',
          type: 'uint256',
        },
        {
          name: 'salt',
          type: 'uint256',
        },
        {
          name: 'makerAssetData',
          type: 'bytes',
        },
        {
          name: 'takerAssetData',
          type: 'bytes',
        },
        {
          name: 'makerFeeAssetData',
          type: 'bytes',
        },
        {
          name: 'takerFeeAssetData',
          type: 'bytes',
        },
      ],
    }
};

export interface EIP712Parameter {
  name: string;
  type: string;
}

export interface EIP712Types {
  [key: string]: EIP712Parameter[];
}

export type EIP712ObjectValue = string | number | EIP712Object;

export interface EIP712Object {
  [key: string]: EIP712ObjectValue;
}

export interface EIP712TypedData {
  types: EIP712Types;
  domain: EIP712Object;
  message: EIP712Object;
  primaryType: string;
}

/**
 * Elliptic Curve signature
 */
 export interface ECSignature {
  v: number;
  r: string;
  s: string;
}