import { PROD, TESTNET, LOCAL, OPENSEA } from './constants';
import api from './api';
import Transaction from './transaction';
import { findChainById } from './utils/chain';
import { Wallet } from './wallet/Wallet';
import wallet from './wallet';
import addresses from './addresses';
import { EVM, IMMUTABLEX, SOLANA } from './utils/chains';
import { Item } from './types/itemInterface';
import currencies from './utils/currencies';
import { isValidERC20 } from './utils/isValidERC20';
import { OpenSeaSDK, Network } from 'opensea-js'
import { serializeOpenSeaOrder } from './utils/serializeOpenSeaOrder';


class Nifty {
  wallet: Wallet;
  key: string;
  env: string;
  api: any;
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


  /**
  * @param order recived from api
  * @returns returns item
  * @returns returns tnx hash value
  */
  async buy(order: any, externalOrder: boolean) {

    if (!this.wallet) {
      throw new Error('Please set wallet');
    }

    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();

    if (externalOrder) {
      switch (order.source) {
        case OPENSEA:
          const openseaSDK = new OpenSeaSDK(this.wallet.provider.currentProvider, {
            networkName: Network.Rinkeby,
          })
          const serializeOrder = serializeOpenSeaOrder(order)
          if (serializeOrder) {
            return await openseaSDK.fulfillOrder({ order: serializeOrder, accountAddress: address })
          }
          return null;

        default:
          break;
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
  * @returns returns order from api
  */
  async sell(item: Item, price: number | string, expirationTime: number, ERC20Address: string): Promise<object> {

    if (!this.wallet) {
      throw new Error('Please set wallet');
    }

    const { contractAddress, tokenID } = item;
    const contractType = item.contractType;
    const itemChainId = item.chainId;

    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();
    const exchangeAddress = addresses[chainId].Exchange;

    if (!isValidERC20(ERC20Address, chainId)) {
      throw new Error('Invalid asset data');
    }

    const transaction = new Transaction({
      wallet: this.wallet,
      address,
      chainId,
    });

    if (this.listener) {
      transaction.setStatusListener(this.listener);
    }

    const sellOrder = await transaction.sell({ contractAddress, tokenID, contractType, price, exchangeAddress, itemChainId, expirationTime, ERC20Address });
    const res = await this.api.orders.create(sellOrder);
    return res.data
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
  * @returns returns NFT balances(1155)
  * @returns returns NFT transfers
  * @returns returns NFT offers
  */
  async getNFTData(item: Item): Promise<object> {
    this.verifyMarkletplace();

    const res = await this.api.tokens.getGraph({
      contractAddress: item.contractAddress,
      tokenID: item.tokenID,
      tokenId: item.id,
      chainId: item.chainId,
      contractType: item.contractType,
    })
    return res.data
  }

  /**
  * @param item item recived from api
  * @param listings array of listings from NFTData
  * @returns returns canBuy
  * @returns returns canSell
  */
  async getUserAvailableMethods(listings: any, item: any): Promise<object> {
    this.verifyMarkletplace();

    if (!this.wallet) {
      throw new Error('Please set wallet');
    }

    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();

    if (String(item.chainId) !== String(chainId)) {
      throw new Error(`Please connect to ${item.chainId}`);
    }

    const transaction = new Transaction({ wallet: this.wallet, address, chainId });
    const isOwner = await transaction.isOwner(item.contractAddress, item.tokenID, item.contract.type);

    const activeListings = listings.filter((list) => list.state === 'ADDED');
    const isListedByOtherThanUser = activeListings.some((list) => list.makerAddress !== address);
    const isUserListingToken = activeListings.some((list) => list.makerAddress === address);

    return ({
      canBuy: (!isOwner || isListedByOtherThanUser) && !!item.price,
      canSell: isOwner && !isUserListingToken,
    })
  }

  async getListing(orderId: number, externalOrder: boolean): Promise<object> {
    this.verifyMarkletplace();

    if (externalOrder) {
      const res = await this.api.externalOrders.get(orderId);
      return res.data

    }

    const res = await this.api.orders.get(orderId)
    return res.data;
  }

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