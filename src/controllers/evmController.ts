import { OPENSEA, NFTRADE, OFFER, orderStatuses, NULL_ADDRESS, NIFTY } from '../constants';
import api from '../api';
import { Wallet } from '../types/Wallet';
import { addressesParameter } from '../addresses';
import { Item } from '../types/ItemInterface';
import currencies from '../utils/currencies';
import { isValidERC20 } from '../utils/isValidERC20';
import { ExternalOrder } from '../types/ExternalOrderInterface';
import { Listings } from '../types/ListingsInterface';
import { Api } from '../types/ApiInterface';
import { Order } from '../types/OrderInterface';
import { env } from '../types/OptionsInterface';
import Emitter from '../utils/emitter';
import { EventType } from '../types/EventType';
import { isExternalOrder } from '../utils/isExternalOrder';
import evmTransaction from '../transaction/blockchainTransaction/evmTransaction';
import { EVM } from '../utils/chains';

class EvmController {
  wallet: Wallet;
  key: string;
  env: env;
  addresses: addressesParameter;
  api: Api;
  getListing: any;
  getNFTOwner: any;
  listener: Function;

  constructor(options) {
    this.wallet = options.wallet;
    this.key = options.key;
    this.env = options.env;
    this.addresses = options.addresses;
    this.api = options.api;
    this.listener = options.listener;
    this.getListing = options.getListing;
    this.getNFTOwner = options.getNFTOwner;
  }
  // what happens if user changes any of the options 

  setMarketplaceAddresses(addresses: addressesParameter) {
    this.addresses = addresses;
  }

  setStatusListener(listener: Function) {
    this.listener = listener;
  }

  setApiBaseURL(url: string) {
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

  verifyWallet() {
    if (!this.wallet) {
      throw new Error('Please set wallet');
    }
  }

  verifyMarkletplace() {
    if (!this.key) {
      throw new Error('key id is missing');
    }
  }

  async initTransaction() {
    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();

    const transaction = new evmTransaction({
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


  async buy(orderId: string, isExternalOrder: boolean = false): Promise<object | string> {
    const order = await this.getListing(orderId, isExternalOrder) as Order | ExternalOrder;
    return this.fillOrder(order);
  }


  async list(item: Item, price: number | string, expirationTime: number, ERC20Address: string = NULL_ADDRESS): Promise<Order> {
    const listRes = await this.signOrder(item, price, expirationTime, ERC20Address);
    const apiResres = await this.api.orders.create(listRes);
    return apiResres.data;
  }


  async offer(item: Item, price: number, expirationTime: number, isFullConversion: boolean) {
    const offerRes = await this.signOffer(item, price, expirationTime, isFullConversion);
    const apiRes = await this.api.orders.create(offerRes);
    return apiRes.data;
  }

  async acceptOffer(orderId: string) {
    const orderRes = await this.getListing(orderId) as Order;
    return this.fillOffer(orderRes);
  }


  async offerTrade(offeredItems: Array<Item>, receivedItems: Array<Item>, expirationTime: number) {
    const offerRes = await this.signTrade(offeredItems, receivedItems, expirationTime);

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

  async transfer(item: Item, addressToSend: string) {
    this.verifyWallet();
    const { contractAddress, tokenID, contractType } = item;

    const transaction = await this.initTransaction();
    await transaction.transfer({ contractAddress, tokenID, contractType, addressToSend });

  }


  async createNFTContract(name: string, symbol: string) {
    this.verifyWallet();

    const transaction = await this.initTransaction();
    const res = await transaction.createNFTContract(name, symbol)

    return res
  }


  async createNFT(metadata: string, selectedCollectionAddress: string) {
    this.verifyWallet();

    const transaction = await this.initTransaction();

    const res = await transaction.createNFT(metadata, selectedCollectionAddress)
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

    if (order.state !== orderStatuses.ADDED) {
      throw new Error('Order is not valid');
    }

    const transaction = await this.initTransaction();

    let res;
    switch (order.source) {
      case OPENSEA:
        res = await transaction.buyFromOpenSea(order as ExternalOrder);
        return res;
      case NIFTY:
        res = await transaction.buy(order as Order);
        return res;
      case NFTRADE:
        res = await transaction.buyOld(order as Order);
        return res;
      default:
        throw new Error('unknown source');
        break;
    }
  }


  /**
  * @param item item recived from api
  * @param price price for the NFT 
  * @param expirationTime Expiration time in UTC seconds.
  * @param ERC20Address to fullfill the order with 
  * @returns returns complete order from api
  */
  async signOrder(item: Item, price: number | string, expirationTime: number, ERC20Address: string): Promise<Order> {

    this.verifyWallet();

    const { contractAddress, tokenID, contractType, chainId: itemChainId } = item;

    const chainId = await this.wallet.chainId();
    const exchangeAddress = this.addresses.Exchange;

    if (ERC20Address !== NULL_ADDRESS && !isValidERC20(ERC20Address, chainId)) {
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


  async signOffer(item: Item, price: number, expirationTime: number, isFullConversion: boolean) {
    this.verifyWallet();

    const exchangeAddress = this.addresses.Exchange;

    const transaction = await this.initTransaction();

    const tokenWithType = JSON.parse(JSON.stringify(item));
    const owner = await this.getNFTOwner(item.contractAddress, item.tokenID, EVM, item.chainId, item.contractType);

    const offerOrder = await transaction.offer({
      item: tokenWithType,
      price: price,
      isFullConversion,
      exchangeAddress,
      expirationTime
    })

    if (owner.id) {
      offerOrder.recipientAddress = owner.id;
    }

    offerOrder.type = OFFER;
    return offerOrder;
  }


  async signTrade(offeredItems: Array<Item>, receivedItems: Array<Item>, expirationTimeSeconds: number) {
    this.verifyWallet();

    const transaction = await this.initTransaction();
    const exchangeAddress = this.addresses.Exchange;

    const res = await transaction.trade({ offeredItems, receivedItems, expirationTimeSeconds, exchangeAddress })
    return res
  }

  async fillTrade(order: Order) {
    this.verifyWallet();
    const transaction = await this.initTransaction();
    const res = await transaction.approveTrade(order);
    return res;
  }


  async invalidateOrder(order: Order) {
    this.verifyWallet();

    const transaction = await this.initTransaction();

    switch (order.source) {
      case NIFTY:
        return transaction.cancelOrder(order)
      case NFTRADE:
        return transaction.cancelOrderOld(order)
      default:
        throw new Error('unknown source');
        break;
    }
  }


  async fillOffer(order: Order) {
    this.verifyWallet();

    if (order.state !== orderStatuses.ADDED) {
      throw new Error('Order is not valid');
    }

    const transaction = await this.initTransaction();

    const res = await transaction.acceptOffer(order)
    return res
  }




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

    const transaction = await this.initTransaction();

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

  async isApproveForAll(item: Item) {
    this.verifyWallet();

    const transaction = await this.initTransaction();

    return transaction.contracts.isApprovedForAll(item)
  }

  async getAccountBalance(ERC20Address = null) {
    this.verifyWallet();

    const transaction = await this.initTransaction();
    const address = await this.wallet.getUserAddress();

    if (!ERC20Address) {
      return transaction.contracts.balanceOfNativeToken();
    }
    return transaction.contracts.balanceOfERC20(address, ERC20Address);
  }

}

export default EvmController;
