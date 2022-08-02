export interface Order {
  id: string;
  createdAt: Date;
  updatedAt: Date;
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
  tokens: Array<OrderItem>;
}

interface OrderItem {
  OrderToken: OrderToken;
  assetData: AssetData;
  attributes: Array<object>;
  blacklist: boolean;
  chainId: number;
  chainType: string;
  contract: Contract;
  contractAddress: string;
  contractId: string;
  contractName: string;
  createdAt: Date;
  description: string;
  external_url: string;
  highest_offer: string;
  id: string;
  image: string;
  last_sell: string;
  last_sell_at: Date;
  listedAt: Date;
  mintTime: string;
  name: string;
  orderId: string;
  preview: string;
  price: string;
  reportsCount: number;
  status: string;
  thumb: string;
  tokenID: string;
  tokenURI: string;
  type: string;
  updatedAt: Date;
}

interface OrderToken {
  createdAt: Date;
  orderId: string;
  tokenId: string;
  type: string;
  updatedAt: Date;

}

interface AssetData {
  access_mode: string;
  api_key: string;
  asset_id: string
  bytes: number;
  colors: Array<Array<string>>;
  created_at: Date;
  eager: Array<object>;
  etag: string;
  format: string;
  height: number;
  original_filename: string;
  overwritten: boolean;
  pages: number;
  placeholder: boolean;
  predominant: object;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: Array<object>;
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number
}

interface Contract {
  address: string;
  ai_generated: boolean;
  chainId: number;
  chainType: string;
  cover_image: string;
  createdAt: string;
  description: string;
  discord: string;
  displayName: string;
  error: boolean;
  exclusive: boolean;
  featured: boolean;
  forked: boolean;
  full_royalty_support: boolean;
  handmade: boolean;
  hot: boolean;
  id: string;
  image: string;
  name: string;
  partial_royalty_support: boolean;
  slug: string;
  symbol: string;
  telegram: string;
  telegramBotChatId: string;
  trending: boolean;
  twitter: string;
  type: string;
  updatedAt: string;
  verified: boolean;
  website: string;
}

interface Trade {
  price: number;
  createdAt: Date;
}