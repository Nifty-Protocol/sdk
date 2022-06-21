import api from './api';
import Transaction from './transaction';
import sign from './signature';
import { findChainById } from './utils/chain';
import { Wallet } from './wallet/Wallet';
import wallet from './wallet';
import addresses from './addresses';

class Nifty {
  wallet: Wallet;
  marketplace: string;
  listener: Function;

  constructor(options) {
    this.marketplace = options.marketplace;
  }

  initWallet(type: string, provider: any) {
    this.wallet = wallet(type, provider);
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

  async sell(token,price) {
    const { contractAddress, tokenID } = token
    const  contractType  = token.contract.type

    const address = await this.wallet.provider.getUserAddress();
    const chainId = await this.wallet.provider.chainId();
    const exchangeAddress = addresses[chainId].Exchange;

    const transaction = new Transaction({
      wallet: this.wallet,
      address,
      chainId,
    });
    if (this.listener) {
      transaction.setStatusListener(this.listener);
    }
    return transaction.sell({ contractAddress, tokenID, contractType, price, exchangeAddress });
    // return ({ contractAddress, tokenID, contractType, price, exchangeAddress });

  }

  verifyMarkletplace() {
    if (!this.marketplace) {
      throw new Error('marketplace id is missing');
    }
  }

  getNFTs(options) {
    this.verifyMarkletplace();
    return api.tokens.getAll({ ...options, marketplace: this.marketplace });
  }

  getListing(orderId) {
    return api.orders.get(orderId);
  }

  static utils = {
    findChainById
  };
}

export default Nifty;