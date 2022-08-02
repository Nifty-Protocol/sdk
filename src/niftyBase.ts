import { OPENSEA, OFFER, orderStatuses, defaultKey } from './constants';
import api from './api';
import Transaction from './transaction';
import { Wallet } from './wallet/Wallet';
import { addressesParameter } from './addresses';
import { Item } from './types/ItemInterface';
import { isValidERC20 } from './utils/isValidERC20';
import { ExternalOrder } from './types/ExternalOrderInterface';
import { Listings } from './types/ListingsInterface';
import { Api } from './types/ApiInterface';
import { Order, OrderWithTxHash } from './types/OrderInterface';
import { env, Options } from './types/OptionsInterface';
import { Seaport } from '@opensea/seaport-js';
import { isExternalOrder } from './utils/isExternalOrder';
import { ethers } from 'ethers';
import { SignedOffer, SignedOrderWithOrderHash } from './types/SignedOrder';

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

  verifyWallet(): void {
    if (!this.wallet) {
      throw new Error('Please set wallet');
    }
  }

  verifyMarkletplace(): void {
    if (!this.key) {
      throw new Error('key id is missing');
    }
  }

  setStatusListener(listener: Function): void {
    this.listener = listener;
  }


  async initTransaction() {
    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();

    const transaction = new Transaction({
      wallet: this.wallet,
      addresses: this.addresses,
      address,
      chainId,
      marketplaceId: this.key
    });

    if (this.listener) {
      transaction.setStatusListener(this.listener);
    }

    return transaction;
  }


  /**
    * @param item item recived from api
    * @param price price for the NFT 
    * @param expirationTime Expiration time in UTC seconds.
    * @param ERC20Address to fullfill the order with 
    * @returns returns complete order from api
    */
  async signOrder(item: Item, price: number | string, expirationTime: number, ERC20Address: string): Promise<SignedOrderWithOrderHash> {

    this.verifyWallet();

    const { contractAddress, tokenID, contractType, chainId: itemChainId } = item;

    const chainId = await this.wallet.chainId();

    const exchangeAddress = this.addresses.Exchange;

    if (!isValidERC20(ERC20Address, chainId)) {
      throw new Error('Invalid ERC20 address');
    }

    const transaction = await this.initTransaction();
    const orderList = await transaction.list({
      contractAddress,
      tokenID,
      contractType,
      price,
      exchangeAddress,
      itemChainId,
      expirationTime,
      ERC20Address
    });

    return orderList;
  }


  /**
    * @param item item recived from api
    * @param price price for the NFT 
    * @param expirationTime Expiration time in UTC seconds.
    * @returns returns complete order from api
    */
  async signOffer(item: Item, price: number, expirationTime: number): Promise<SignedOffer> {
    this.verifyWallet();

    const exchangeAddress = this.addresses.Exchange;

    const transaction = await this.initTransaction();

    const tokenWithType = JSON.parse(JSON.stringify(item));
    const owner = await this.getNftOwner(item.contractAddress, item.tokenID, item.chainId, item.contractType);

    const offerOrder = await transaction.offer({
      item: tokenWithType,
      price: price,
      isFullConversion: false,
      exchangeAddress,
      expirationTime
    }) as any;

    if (owner.id) {
      offerOrder.recipientAddress = owner.id;
    }

    offerOrder.type = OFFER;
    return offerOrder;
  }


  /**
    * @param offeredItems array of items recived from api
    * @param receivedItems array of items recived from api 
    * @param expirationTime Expiration time in UTC seconds.
    * @returns returns complete order from api
    */
  async signTrade(offeredItems: Array<Item>, receivedItems: Array<Item>, expirationTimeSeconds: number): Promise<SignedOrderWithOrderHash>  {
    this.verifyWallet();

    const transaction = await this.initTransaction();
    const exchangeAddress = this.addresses.Exchange;

    const res = await transaction.trade({ offeredItems, receivedItems, expirationTimeSeconds, exchangeAddress })
    return res
  }


  /**
  * @param order recived from api
  * @returns returns item
  * @returns returns tnx hash value
  */
  async fillTrade(order: Order): Promise<OrderWithTxHash> {
    this.verifyWallet();
    const transaction = await this.initTransaction();
    const res = await transaction.approveTrade(order);
    return res;
  }


  /**
  * @param order recived from api
  * @returns returns item
  * @returns returns tnx hash value
  */
  async fillOffer(order: Order): Promise<OrderWithTxHash> {
    this.verifyWallet();

    if (order.state !== orderStatuses.ADDED) {
      throw new Error('Order is not valid');
    }

    const transaction = await this.initTransaction();

    const res = await transaction.acceptOffer(order)
    return res
  }


  /**
  * @param order recived from api
  * @param externalOrder boolean if order is external
  * @returns returns item
  * @returns returns tnx hash value
  */
  async fillOrder(order: Order | ExternalOrder): Promise<object | string> {

    this.verifyWallet();

    const address = await this.wallet.getUserAddress();

    if (order.state !== orderStatuses.ADDED) {
      throw new Error('Order is not valid');
    }


    if (isExternalOrder(order)) {
      const ExternalOrder = order as ExternalOrder;
      switch (ExternalOrder.source) {
        case OPENSEA:
          const provider = new ethers.providers.Web3Provider(this.wallet.web3.currentProvider);
          const seaport = new Seaport(provider);

          const { executeAllActions: executeAllFulfillActions } =
            await seaport.fulfillOrder({
              order: order.raw.protocol_data,
              accountAddress: String(address),
            });

          const openSeaTransaction = await executeAllFulfillActions();
          return openSeaTransaction;

        default:
          break;
      }
    }

    const transaction = await this.initTransaction();

    const res = await transaction.buy(order as Order);
    return res;
  }


  /**
    * @param contractAddress string contract address
    * @param tokenID number token id 
    * @param chainId number chain id
    * @param contractType ERC721/ERC1155 
    * @returns object
    */
  async getNftOwner(contractAddress: string, tokenID: number | string, chainId: number, contractType: string, orderId?: string): Promise<{ username: string, image: string, id: string }> {
    const res = await this.api.tokens.getOwner({
      contractAddress: contractAddress,
      tokenID,
      chainId,
      orderId,
      contractType: contractType,
    })
    return res.data
  };


  /**
  * @param item item recived from api
  * @param listings array of listings from getNFTData
  * @returns returns canBuy
  * @returns returns canSell
  */
  async getUserAvailableMethods(listings: Listings, item: Item): Promise<{ canBuy: boolean, canSell: boolean, canCancel: boolean, canOffer: boolean }> {

    this.verifyMarkletplace();
    this.verifyWallet();

    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();
    const { contractAddress, tokenID, contractType, chainId: itemChainId } = item;

    if (String(itemChainId) !== String(chainId)) {
      throw new Error(`Please connect to ${itemChainId}`);
    }

    const transaction = new Transaction({
      wallet: this.wallet,
      addresses: this.addresses,
      address,
      chainId,
      marketplaceId: this.key
    });

    const isOwner = await transaction.isOwner(contractAddress, tokenID, contractType);
    const activeListings = listings.filter((list) => list.state === 'ADDED');
    const isListedByOtherThanUser = activeListings.some((list) => list.makerAddress !== address);
    const isUserListingToken = activeListings.some((list) => list.makerAddress === address);

    let order;
    if (item.orderId) {
      order = listings.find((x) => x.id === item.orderId);
    }

    return ({
      canBuy: (!isOwner || isListedByOtherThanUser) && !!item.price,
      canSell: isOwner && !isUserListingToken,
      canCancel: !!order && order.makerAddress === address,
      canOffer: !isOwner
    })
  }


  /**
   * @param order recived from api
   * @returns returns tnx hash value
   */
  async invalidateOrder(order: Order): Promise<string> {
    this.verifyWallet();

    const transaction = await this.initTransaction();

    const transactionHash = await transaction.cancelOrder(order)
    return transactionHash;
  }


  /**
  * @param item recived from api
  * @returns returns boolean
  */
  async isApproveForAll(item: Item): Promise<boolean> {
    this.verifyWallet();

    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();

    const transaction = new Transaction({
      wallet: this.wallet,
      addresses: this.addresses,
      address,
      chainId,
      marketplaceId: this.key
    });

    return transaction.contracts.isApprovedForAll(item)
  }
}
