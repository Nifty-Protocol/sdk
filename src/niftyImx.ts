import { defaultKey } from './constants';
import api from './api';
import { Wallet } from './wallet/Wallet';
import wallet from './wallet';
import { Item } from './types/ItemInterface';
import { ExternalOrder } from './types/ExternalOrderInterface';
import { Api } from './types/ApiInterface';
import { Order } from './types/OrderInterface';
import { env, Options } from './types/OptionsInterface';
import Emitter from './utils/emitter';
import { EventType } from './types/EventType';
import { providers } from 'ethers';
import TransactionImmutableX from './transaction/TransactionImx';
import { NiftyBase } from './niftyBase';

export class NiftyImx extends NiftyBase{
  wallet: Wallet;
  key: string;
  env: env;
  api: Api;
  listener: Function;

  constructor(options: Options) {
    super(options);
    this.key = options.key || defaultKey;
    this.env = options.env;
    this.api = api(this.env);
  }

  async initWallet(type: string, provider: providers.Provider) {
    this.wallet = wallet(type, provider);
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

  verifyMarkletplace() {
    if (!this.key) {
      throw new Error('key id is missing');
    }
  }

  verifyWallet() {
    if (!this.wallet) {
      throw new Error('Please set wallet');
    }
  }


  async initTransaction() {
    const address = await this.wallet.getUserAddress();
    const chainId = await this.wallet.chainId();

    const transaction = new TransactionImmutableX({
      wallet: this.wallet,
      address,
      chainId,
    })


    if (this.listener) {
      transaction.setStatusListener(this.listener);
    }

    return transaction;
  }


  async buy(orderId: string): Promise<object | string> {
    const order = await this.getListing(orderId, true) as ExternalOrder;
    return this.fillOrder(order);
  }


  async list(item: Item, price: number | string) {
    const listRes = await this.signOrder(item, price);

    return listRes;
  }


  async cancelOrder(orderId: string) {
    const orderRes = await this.getListing(orderId, true) as ExternalOrder;
    return this.invalidateOrder(orderRes);
  }


  async fillOrder(order: ExternalOrder): Promise<object | string> {

    this.verifyWallet();

    const transaction = await this.initTransaction();

    const res = await transaction.buy(order as ExternalOrder);
    return res;
  }


  /**
  * @param item item recived from api
  * @param price price for the NFT 
  * @param expirationTime Expiration time in UTC seconds.
  * @param ERC20Address to fullfill the order with 
  * @returns returns complete order from api
  */
  async signOrder(item: Item, price: number | string): Promise<Order> {

    this.verifyWallet();

    const { contractAddress, tokenID, chainId: itemChainId } = item;


    const transaction = await this.initTransaction();
    const orderList = await transaction.list({
      contractAddress,
      tokenID,
      price,
      itemChainId,
    });

    return orderList;
  }



  async invalidateOrder(order: ExternalOrder) {
    this.verifyWallet();

    const transaction = await this.initTransaction();

    const transactionHash = await transaction.cancelOrder(order)
    return transactionHash;
  }


  async getAccountBalance() {
    this.verifyWallet();

    const transaction = await this.initTransaction();
    const address = await this.wallet.getUserAddress();

    const res = await transaction.getBalance(address)
    return res
  }

}