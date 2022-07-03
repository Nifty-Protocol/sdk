export interface ExternalOrder {
  id: string;
  tokenId: string;
  source: string;
  price: number;
  listingTime: Date;
  makerAddress: string;
  takerAddress: string;
  makerAssetData: string;
  takerAssetData: string;
  makerAssetAmount: string;
  takerAssetAmount: string;
  type: string;
  state: string;
  chainId: string;
  raw: any;
  orderHash: string;
  contractAddress: string;
  tokenID: string;
  txHash: string;
  txDetails: object;
  updatedAt: string;
}