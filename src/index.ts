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

  async buy(order) {
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
    return transaction.buy(order);
  }

  verifyMarkletplace() {
    if (!this.marketplace) {
      throw new Error('marketplace id is missing');
    }
  }

  getNFTs(options) {
    this.verifyMarkletplace();
    return api.tokens.getAll({...options, marketplace: this.marketplace}); 
  }

  getListing(orderId) {
    return api.orders.get(orderId);
  }
  
  static utils = {
    findChainById
  };
}

export default Nifty;