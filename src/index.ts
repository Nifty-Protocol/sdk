import { PROD, TESTNET, LOCAL, OPENSEA } from './constants';
import api from './api';
import Transaction from './transaction';
import { findChainById } from './utils/chain';
import { Wallet } from './wallet/Wallet';
import wallet from './wallet';
import addresses from './addresses';
import { EVM, IMMUTABLEX, SOLANA } from './utils/chains';
import { Item } from './types/ItemInterface';
import currencies from './utils/currencies';
import { isValidERC20 } from './utils/isValidERC20';
import { OpenSeaSDK, Network } from 'opensea-js'
import { serializeOpenSeaOrder } from './utils/serializeOpenSeaOrder';
import { ExternalOrder } from './types/ExternalOrderInterface';
import { Order } from 'opensea-js/lib/types';
import { Listings } from './types/ListingsInterface';
import { Api } from './types/ApiInterface';


class Nifty {
  wallet: Wallet;
  key: string;
  env: string;
  api: Api;
  listener: Function;

  constructor(options) {
    this.key = options.key;
    this.env = options.env;
    this.api = api(this.env);
  }

  initWallet(type: string, provider: any) {
    this.wallet = wallet(type, provider);
  }

  setStatusListener(listener: Function) {
    this.listener = listener;
  }

  verifyMarkletplace() {
    if (!this.key) {
      throw new Error('key id is missing');
    }
  }


  /**
  * @param order recived from api
  * @param externalOrder boolean if order is external
  * @returns returns item
  * @returns returns tnx hash value
  */
  async buy(order: Order | ExternalOrder, externalOrder: boolean = false) {

    if (!this.wallet) {
      throw new Error('Please set wallet');
    }

    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();

    if (externalOrder) {
      const ExternalOrder = order as ExternalOrder;
      try {
        switch (ExternalOrder.source) {
          case OPENSEA:
            const networkName = this.env === PROD ? Network.Main : Network.Rinkeby;
            const openseaSDK = new OpenSeaSDK(this.wallet.provider.currentProvider, {
              networkName
            })

            const serializeOrder = serializeOpenSeaOrder(ExternalOrder)
            return await openseaSDK.fulfillOrder({ order: serializeOrder, accountAddress: address })

          default:
            break;
        }
      } catch (e) {
        throw new Error(e)
      }
    }

    const transaction = new Transaction({
      wallet: this.wallet,
      address,
      chainId,
    });

    if (this.listener) {
      transaction.setStatusListener(this.listener);
    }
    return transaction.buy(order);
  }


  /**
  * @param item item recived from api
  * @param price price for the NFT 
  * @param expirationTime Expiration time in UTC seconds.
  * @param ERC20Address to fullfill the order with 
  * @returns returns complete order from api
  */
  async list(item: Item, price: number | string, expirationTime: number, ERC20Address: string): Promise<object> {

    if (!this.wallet) {
      throw new Error('Please set wallet');
    }

    const { contractAddress, tokenID, contractType, chainId: itemChainId } = item;

    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();
    const exchangeAddress = addresses[chainId].Exchange;

    if (!isValidERC20(ERC20Address, chainId)) {
      throw new Error('Invalid ERC20 address');
    }

    const transaction = new Transaction({
      wallet: this.wallet,
      address,
      chainId,
    });

    if (this.listener) {
      transaction.setStatusListener(this.listener);
    }

    const orderList = await transaction.list({ contractAddress, tokenID, contractType, price, exchangeAddress, itemChainId, expirationTime, ERC20Address });
    const res = await this.api.orders.create(orderList);
    return res.data
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
  async getNFTs(options: object): Promise<object> {
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
  async getNFT(contractAddress: string, tokenID: number, chainId: number): Promise<object> {
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
  async getNFTData(item: Item): Promise<object> {
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
  * @param item item recived from api
  * @param listings array of listings from getNFTData
  * @returns returns canBuy
  * @returns returns canSell
  */
  async getUserAvailableMethods(listings: Listings, item: Item): Promise<object> {
    this.verifyMarkletplace();

    if (!this.wallet) {
      throw new Error('Please set wallet');
    }

    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();
    const { contractAddress, tokenID, contractType, chainId: itemChainId } = item;

    if (String(itemChainId) !== String(chainId)) {
      throw new Error(`Please connect to ${itemChainId}`);
    }

    const transaction = new Transaction({ wallet: this.wallet, address, chainId });
    const isOwner = await transaction.isOwner(contractAddress, tokenID, contractType);

    const activeListings = listings.filter((list) => list.state === 'ADDED');
    const isListedByOtherThanUser = activeListings.some((list) => list.makerAddress !== address);
    const isUserListingToken = activeListings.some((list) => list.makerAddress === address);

    return ({
      canBuy: (!isOwner || isListedByOtherThanUser) && !!item.price,
      canSell: isOwner && !isUserListingToken,
    })
  }


  /**
  * @param orderId order id from item 
  * @param externalOrder boolean if the order is external
  * @returns listing
  */
  async getListing(orderId: number, externalOrder: boolean = false): Promise<object> {
    this.verifyMarkletplace();

    if (externalOrder) {
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
  getAvailablePaymentMethods(chainId?: number | string): Array<object> {
    this.verifyMarkletplace();

    if (chainId) {
      return currencies.filter(x => x.chainId === Number(chainId))
    }
    return currencies
  }

  static utils = {
    findChainById
  };

  static networkTypes = {
    EVM,
    IMMUTABLEX,
    SOLANA,
  };

  static envs = {
    PROD,
    TESTNET,
    LOCAL,
  };

}

export default Nifty;