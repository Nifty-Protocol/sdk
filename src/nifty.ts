import { PROD, TESTNET, defaultKey, NULL_ADDRESS } from './constants';
import api from './api';
import { findChainById } from './utils/chain';
import { Wallet } from './types/Wallet';
import wallet from './wallet';
import addresses, { addressesParameter } from './addresses';
import { EVM, IMMUTABLEX, SOLANA, XRPL } from './utils/chains';
import { Item } from './types/ItemInterface';
import { Listing, Listings } from './types/ListingsInterface';
import { Api } from './types/ApiInterface';
import { Order } from './types/OrderInterface';
import { env, Options } from './types/OptionsInterface';
import Emitter from './utils/emitter';
import { EventType } from './types/EventType';
import transactionConfirmation from './utils/transactionConfirmation';
import { providers } from 'ethers';
import blockChainControllerInit from './utils/blockChainControllerInit';
import { NetworkType } from './types/NetworkType';
import { Balances, Transfers } from './types/NftDataResponse';

export class Nifty {
  wallet: Wallet;
  key: string;
  env: env;
  addresses: addressesParameter;
  api: Api;
  blockChainController: any;
  listener: Function;

  constructor(options: Options) {
    this.key = options.key || defaultKey;
    this.env = options.env;
    this.api = api(this.env);
  }

  async initWallet(NetworkType: NetworkType, provider: providers.Provider) {
    this.wallet = wallet(NetworkType, provider);
    const chainId = await this.wallet.chainId();
    this.setMarketplaceAddresses(addresses[chainId]);

    const options = {
      key: this.key,
      env: this.env,
      addresses: this.addresses,
      api: this.api,
      wallet: this.wallet,
      listener: this.listener,
      getListing: this.getListing,
      getNFTOwner: this.getNFTOwner,
    };

    this.blockChainController = await blockChainControllerInit(NetworkType, options);
  }

  setMarketplaceAddresses(addresses: addressesParameter) {
    if (this.blockChainController) {
      this.blockChainController.setMarketplaceAddresses(addresses);
    }

    this.addresses = addresses;
  }

  setStatusListener(listener: Function) {
    if (this.blockChainController) {
      this.blockChainController.setStatusListener(listener);
    }

    this.listener = listener;
  }

  setApiBaseURL(url: string) {
    if (this.blockChainController) {
      this.blockChainController.setApiBaseURL(url);
    }

    this.api = api(this.env, url);
  }

  addListener(listener: Function, event: EventType, once = false) {
    if (once) {
      Emitter.once(event, listener);
    }
    else {
      Emitter.on(event, listener);
    }
  }

  verifyMarkletplace() {
    if (!this.key) {
      throw new Error('key id is missing');
    }
  }


  async buy(orderId: string, isExternalOrder: boolean = false) {
    return this.blockChainController.buy(orderId, isExternalOrder);
  }


  async list(item: Item, price: number | string, expirationTime: number, ERC20Address: string = NULL_ADDRESS): Promise<Order> {
    return this.blockChainController.list(item, price, expirationTime, ERC20Address);
  }


  async offer(item: Item, price: number, expirationTime: number, isFullConversion: boolean) {
    return this.blockChainController.offer(item, price, expirationTime, isFullConversion);
  }

  async acceptOffer(orderId: string) {
    return this.blockChainController.acceptOffer(orderId);
  }


  async offerTrade(offeredItems: Array<Item>, receivedItems: Array<Item>, expirationTime: number) {
    return this.blockChainController.offerTrade(offeredItems, receivedItems, expirationTime);
  }


  async acceptTrade(orderId: string) {
    return this.blockChainController.acceptTrade(orderId);
  }


  async cancelOrder(orderId: string) {
    return this.blockChainController.cancelOrder(orderId);
  }

  async transfer(item: Item, addressToSend: string) {
    return this.blockChainController.transfer(item, addressToSend);
  }


  async createNFTContract(name: string, symbol: string) {
    return this.blockChainController.createNFTContract(name, symbol);
  }


  async createNFT(metadata: string, selectedCollectionAddress: string) {
    return this.blockChainController.createNFT(metadata, selectedCollectionAddress);
  }

  async getCollections() {
    return this.blockChainController.getCollections();
  }


  getAvailablePaymentMethods(chainId?: number | string, defaultPaymentMethod: boolean = false): Array<object> {
    return this.blockChainController.getAvailablePaymentMethods(chainId, defaultPaymentMethod);
  }

  async isApproveForAll(item: Item) {
    return this.blockChainController.isApproveForAll(item);
  }

  async getAccountBalance(ERC20Address = null) {
    const address = await this.wallet.getUserAddress();
    return this.blockChainController.getAccountBalance(ERC20Address, address)
  }


  /**
  * @param item item recived from api
  * @param listings array of listings from getNFTData
  * @returns returns canBuy
  * @returns returns canSell
  */
  async getUserAvailableMethods(listings: Listings, item: Item): Promise<{ canBuy: boolean, canSell: boolean, canCancel: boolean, canOffer: boolean }> {
    return this.blockChainController.getUserAvailableMethods(listings, item);
  }


  async getAllNFTData(contractAddress: string, tokenID: number, chainId: number) {
    const nft = await this.getNFT(contractAddress, tokenID, chainId);
    const nftData = await this.getNFTData(nft.contractAddress, nft.tokenID, nft.contractType, nft.chainType, nft.chainId, nft.id);

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
  async getNFT(contractAddress: string, tokenID: number, chainId: number, chainType: string = EVM): Promise<Item> {
    this.verifyMarkletplace();

    const res = await this.api.tokens.get(contractAddress, tokenID, { chainId, chainType });
    return res.data
  }

  /**
  * @param item item recived from api
  * @returns returns NFT data object
      * @returns returns NFT balances(1155)
      * @returns returns NFT transfers
      * @returns returns NFT offers
  */
  async getNFTData(contractAddress: string, tokenID: number | string, contractType: string, chainType: string, chainId: number, tokenId: string): Promise<{ balances: Array<Balances>, transfers: Array<Transfers>, listings: Array<Listing>, offers: Array<any> }> {
    this.verifyMarkletplace();

    const res = await this.api.tokens.getGraph({
      contractAddress,
      tokenID,
      chainType,
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
    // this.verifyMarkletplace();

    if (isExternalOrder) {
      const res = await this.api.externalOrders.get(orderId);
      return res.data
    }

    const res = await this.api.orders.get(orderId)
    return res.data;
  }

  async getNFTOwner(contractAddress: string, tokenID: number | string, chainType: string, chainId: number, contractType: string, orderId?: string) {
    const res = await this.api.tokens.getOwner({
      contractAddress,
      tokenID,
      chainType,
      chainId,
      orderId,
      contractType,
    })
    return res.data
  };



  static utils = {
    findChainById,
    transactionConfirmation
  };

  static networkTypes = {
    EVM,
    IMMUTABLEX,
    SOLANA,
    XRPL,
  };

  static envs = {
    PROD,
    TESTNET,
  };

}

