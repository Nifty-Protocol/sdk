import api from './api';
import Transaction from './transaction';
import sign from './signature';
import Wallet from './wallet';
import { findChainById } from './utils/chain';

class Nifty {
  wallet: Wallet;
  marketplace: string;
  listener: Function;

  constructor(options) {
    this.marketplace = options.marketplace;
  }

  initWallet(type: string, provider: any) {
    this.wallet = new Wallet(type, provider);
  }

  setStatusListener(listener: Function) {
    this.listener = listener;
  }

  async buy(item) {
    const address = await this.wallet.provider.getUserAddress();
    const chainId = await this.wallet.provider.chainId();
    const transaction = new Transaction({
      wallet: this.wallet,
      address,
      chainId,
    });
    if (this.listener) {
      transaction.setStatusListener(this.listener);
    }
    return transaction.buy(item);
  }

  getNFTs(options) {
    return api.tokens.getAll(options);
  }

  getListing(orderId) {
    return api.orders.get(orderId);
  }
  
  static utils = {
    findChainById
  };
}

export default Nifty;