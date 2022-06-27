import { PROD, TESTNET, LOCAL } from './constants';
import api from './api';
import Transaction from './transaction';
import sign from './signature';
import { findChainById } from './utils/chain';
import { Wallet } from './wallet/Wallet';
import wallet from './wallet';
import addresses from './addresses';
import { EVM, IMMUTABLEX, SOLANA } from './utils/chains';
import { itemInterface } from './types/itemInterface';

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
  async buy(order: any) {

    if (!this.wallet) {
      throw new Error('Please set wallet');
    }

    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();

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
  * @returns returns order from api
  */
  async sell({ item, price, expirationTime }: { item: itemInterface, price: number | string, expirationTime: number }): Promise<object> {

    if (!this.wallet) {
      throw new Error('Please set wallet');
    }

    const { contractAddress, tokenID } = item;
    const contractType = item.contractType;
    const itemChainId = item.chainId;

    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();
    const exchangeAddress = addresses[chainId].Exchange;

    const transaction = new Transaction({
      wallet: this.wallet,
      address,
      chainId,
    });

    if (this.listener) {
      transaction.setStatusListener(this.listener);
    }
    const sellOrder = await transaction.sell({ contractAddress, tokenID, contractType, price, exchangeAddress, itemChainId, expirationTime });
    return this.api.orders.create(sellOrder);
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
  getNFTs(options: object): Promise<object> {
    this.verifyMarkletplace();
    return this.api.tokens.getAll({ ...options, key: this.key });
  }


  /**
  * @param contractAddress NFT contract address
  * @param tokenID NFT token id 
  * @param chainId chain id of the NFT
  * @returns returns NFT from api
  */
  getNFT(contractAddress: string, tokenID: number, chainId: number): Promise<object> {
    this.verifyMarkletplace();
    return this.api.tokens.get(contractAddress, tokenID, { chainId });
  }


  /**
  * @param item item recived from api
  * @returns returns NFT balances(1155)
  * @returns returns NFT transfers
  * @returns returns NFT offers
  */
  getNFTData(item: itemInterface): Promise<object> {
    this.verifyMarkletplace();
    return this.api.tokens.getGraph({
      contractAddress: item.contractAddress,
      tokenID: item.tokenID,
      tokenId: item.id,
      chainId: item.chainId,
      contractType: item.contractType,
    })
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


  getListing(orderId: number): object {
    this.verifyMarkletplace();
    return this.api.orders.get(orderId);
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