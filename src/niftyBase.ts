import api from './api';
import { Wallet } from './wallet/Wallet';
import { addressesParameter } from './addresses'
import { Item } from './types/ItemInterface';
import { Api } from './types/ApiInterface';
import { env, Options } from './types/OptionsInterface';
import { defaultKey } from './constants';

export class NiftyBase {
  wallet: Wallet;
  key: string;
  env: env;
  addresses: addressesParameter;
  api: Api;
  listener: Function;

  constructor(options: Options) {
    this.key = options.key || defaultKey;
    this.env = options.env;
    this.api = api(this.env);
  }


  setApiBaseURL(url: string) {
    this.api = api(this.env, url);
  }

  
  verifyMarkletplace() {
    if (!this.key) {
      throw new Error('key id is missing');
    }
  }


  /**
   * @param filter options  
      * @param filter.contracts array of contracts to filter by
      * @param filter.search string to search by  
      * @param filter.order has order attached
      * @param filter.verified only show verified listings
      * @param filter.priceRange array of price range [min,max] 
      * @param filter.chains array of chains [] 
      * @param filter.address user address to filter by 
      * @param filter.connectedChainId chain id of the user address
      * @param filter.traits array of traits to filter by
      * @param filter.sort string to sort by
      * @param filter.limit number on NFTs to return
      * @param filter.skip number of NFTs to skip
   * @returns returns NFTs from api
   */
  async getNFTs(options: object): Promise<Array<Item>> {

    this.verifyMarkletplace();

    const res = await this.api.tokens.getAll({ ...options, key: this.key });
    return res.data
  }


  /**
  * @param contractAddress NFT contract address
  * @param tokenID NFT token id 
  * @param chainId chain id of the NFT
  * @returns returns NFT from api
  */
  async getNFT(contractAddress: string, tokenID: number, chainId: number): Promise<Item> {

    this.verifyMarkletplace();

    const res = await this.api.tokens.get(contractAddress, tokenID, { chainId });
    return res.data
  }


  /**
  * @param item item recived from api
  * @returns returns NFT data object
      * @returns returns NFT balances(1155)
      * @returns returns NFT transfers
      * @returns returns NFT offers
  */
  async getNFTData(item: Item): Promise<{ balances: Array<object>, transfers: Array<object>, listings: Array<object>, offers: Array<object> }> {

    this.verifyMarkletplace();

    const { contractAddress, tokenID, contractType, chainId, id: tokenId } = item;

    const res = await this.api.tokens.getGraph({
      contractAddress,
      tokenID,
      chainId,
      contractType,
      tokenId,
    })
    return res.data
  }


  /**
  * @param orderId order id from item 
  * @param externalOrder boolean if the order is external
  * @returns listing
  */
  async getListing(orderId: string, isExternalOrder: boolean = false): Promise<object> {
    this.verifyMarkletplace();

    if (isExternalOrder) {
      const res = await this.api.externalOrders.get(orderId);
      return res.data
    }

    const res = await this.api.orders.get(orderId)
    return res.data;
  }

  async getNftOwner(contractAddress: string, tokenID: number | string, chainId: number, contractType: string, orderId?: string) {
    const res = await this.api.tokens.getOwner({
      contractAddress: contractAddress,
      tokenID,
      chainId,
      orderId,
      contractType: contractType,
    })
    return res.data
  };
}
