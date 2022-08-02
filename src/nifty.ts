import { PROD, TESTNET, NULL_ADDRESS } from './constants';
import api from './api';
import { findChainById } from './utils/chain';
import wallet from './wallet';
import addresses, { addressesParameter } from './addresses';
import { EVM, IMMUTABLEX, SOLANA } from './utils/chains';
import { Item } from './types/ItemInterface';
import currencies from './utils/currencies';
import { ExternalOrder } from './types/ExternalOrderInterface';
import { Listings } from './types/ListingsInterface';
import { Api } from './types/ApiInterface';
import { Order } from './types/OrderInterface';
import { Options } from './types/OptionsInterface';
import Emitter from './utils/emitter';
import { EventType } from './types/EventType';
import transactionConfirmation from './utils/transactionConfirmation';
import { providers } from 'ethers';
import { NiftyBase } from './niftyBase';

export class Nifty extends NiftyBase {
  api: Api;
  listener: Function;

  constructor(options: Options) {
    super(options);
    this.api = api(this.env);
  }


  async initWallet(type: string, provider: providers.Provider) {
    this.wallet = wallet(type, provider);
    
    const chainId = await this.wallet.chainId()
    this.setMarketplaceAddresses(addresses[chainId]);
  }


  setMarketplaceAddresses(addresses: addressesParameter) {
    this.addresses = addresses;
  }


  addListener(listener: Function, event: EventType, once = false) {
    if (once) {
      Emitter.once(event, listener);
    }
    else {
      Emitter.on(event, listener);
    }
  }


  async buy(orderId: string, isExternalOrder: boolean = false): Promise<object | string> {
    const order = await this.getListing(orderId, isExternalOrder) as Order | ExternalOrder;
    return this.fillOrder(order);
  }


  async list(item: Item, price: number | string, expirationTime: number, ERC20Address: string = NULL_ADDRESS): Promise<Order> {
    const listRes = await this.signOrder(item, price, expirationTime, ERC20Address);
    const apiResres = await this.api.orders.create(listRes);
    return apiResres.data;
  }


  async offer(item: Item, price: number, expirationTime: number) {
    const offerRes = await this.signOffer(item, price, expirationTime);
    const apiRes = await this.api.orders.create(offerRes);
    return apiRes.data;
  }


  async acceptOffer(orderId: string) {
    const orderRes = await this.getListing(orderId) as Order;
    return this.fillOffer(orderRes);
  }


  async offerTrade(offeredItems: Array<Item>, receivedItems: Array<Item>, expirationTime: number) {
    const offerRes = await this.signTrade(offeredItems, receivedItems, expirationTime) as any;

    offerRes.type = 'TRADE';
    offerRes.recipientAddress = receivedItems[0].owner.id;
    offerRes.tokens = [...offeredItems, ...receivedItems];

    const apiRes = await this.api.orders.create(offerRes);
    return apiRes.data;
  }


  async acceptTrade(orderId: string) {
    const orderRes = await this.getListing(orderId) as Order;
    return this.fillTrade(orderRes);
  }


  async cancelOrder(orderId: string) {
    const orderRes = await this.getListing(orderId) as Order;
    return this.invalidateOrder(orderRes);
  }


  async getAllNFTData(contractAddress: string, tokenID: number, chainId: number) {
    const nft = await this.getNFT(contractAddress, tokenID, chainId);
    const nftData = await this.getNFTData(nft);

    if (this.wallet) {
      const userAvailableMethods = await this.getUserAvailableMethods(nftData.listings as Listings, nft);
      return {
        nft,
        nftData,
        userAvailableMethods
      }
    }

    return {
      nft,
      nftData
    }
  }


  /**
   * @param options options  
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


  /**
  * @param chainId optional chain id  
  * @returns currencies
  */
  getAvailablePaymentMethods(chainId?: number | string, defaultPaymentMethod: boolean = false): Array<object> {
    this.verifyMarkletplace();

    if (chainId) {
      if (defaultPaymentMethod) {
        return currencies.filter(x => x.chainId === Number(chainId) && x.defaultPaymentMethod);
      }

      return currencies.filter(x => x.chainId === Number(chainId))
    }
    return currencies
  }


  static utils = {
    findChainById,
    transactionConfirmation
  };

  static networkTypes = {
    EVM,
    IMMUTABLEX,
    SOLANA,
  };

  static envs = {
    PROD,
    TESTNET,
  };

}
