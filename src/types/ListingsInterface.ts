export interface Listing {
  price: number,
  id: string,
  type: string,
  state: string,
  makerAddress: string,
  takerAddress: string,
  recipientAddress: string | null,
  createdAt: string,
  makerAssetAmount: string,
  takerAssetAmount: string,
  makerFee: string,
  takerFee: string,
  activities: Array<{
    createdAt: string,
    type: string
  }>}


export type Listings = Array<Listing>;
