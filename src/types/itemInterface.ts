
export interface Item {
  id: string;
  contractName: string;
  contractAddress: string;
  tokenID: string | number;
  tokenURI: string;
  name: string;
  description: string;
  image: string;
  external_url: string;
  thumb: string;
  mintTime: number;
  attributes: Array<object>;
  price: number;
  last_sell: number;
  last_sell_at: number;
  highest_offer: number;
  preview: string;
  type: string;
  orderType: string;
  assetData: object;
  chainId: number;
  chainType: string;
  blacklist: boolean;
  owner: string;
  contractVerified: boolean;
  contractType: string;
  status: string;
  listedAt: string;
  reportsCount: number;
  updatedAt: string;
  createdAt: string;
  contractId: string;
  orderId: string;
  contract: object;
  repotrs: Array<object>;
}