import { Item } from "./ItemInterface";

export interface Order {
  id: string;
  createdAt: Date;
  chainId: string;
  senderAddress: string;
  makerAddress: string;
  takerAddress: string;
  makerAssetData: string;
  takerAssetData: string;
  exchangeAddress: string;
  feeRecipientAddress: string;
  expirationTimeSeconds: string;
  makerFee: string;
  takerFee: string;
  makerAssetAmount: string;
  takerAssetAmount: number;
  salt: string;
  signature: string;
  makerFeeAssetData: string;
  takerFeeAssetData: string;
  recipientAddress: string;
  orderHash: string;
  state: string;
  type: string;
  price: number;
  trades: Array<Trade>;
  tokens: Array<Item>;
}

interface Trade {
  price:number;
  createdAt: Date;
}