import BigNumber from 'bignumber.js';
import Contracts from './contracts';
import { createOrder, destructOrder } from './order';
import {
  CREATING,
  APPROVING,
  APPROVED,
  CONVERT,
} from '../constants';
import Buy from './buy/buy';

class Transaction {
  listener: Function;
  marketplaceId: string;
  walletProvider: any;
  provider: any;
  address: any;
  chainId: any;
  contracts: any;
  walletData: any;
  buy: any;

  constructor(marketplaceId: string) {
    this.marketplaceId = marketplaceId;
    // this.buy = Buy(this.listener);
  }

  async setWalletData(data) {
    this.walletData = data;
    // this.buy.setWalletProvider(data.walletProvider);

  }

  buy(item){
    this.buy = Buy(this.listener);
    this.buy.setWalletProvider(this.walletData.walletProvider);
    return this.buy.signOrder(item);
  }
  setStatusListener(listener: Function) {
    this.listener = listener;
  }

  setStatus(status) {
    if (this.listener) {
      setTimeout(() => this.listener(status), 0);
    }
  }
  
}

const transactions = (marketplaceId: string) => new Transaction(marketplaceId);

export default transactions;
