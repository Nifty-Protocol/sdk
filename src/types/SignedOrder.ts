export interface SignedOrder {
  chainId: number;
  exchangeAddress: string;
  expirationTimeSeconds: string;
  makerAddress: string;
  makerAssetAmount: string;
  makerAssetData: string;
  royaltiesAddress: string;
  royaltiesAmount: string;
  salt: number;
  senderAddress: string;
  signature: string;
  takerAddress: string;
  takerAssetAmount: string;
  takerAssetData: string;
  
}

export interface SignedOrderWithOrderHash extends SignedOrder {
  orderHash: string;
}

export interface SignedOffer extends SignedOrderWithOrderHash {
  recipientAddress:string;
  type: string;
}