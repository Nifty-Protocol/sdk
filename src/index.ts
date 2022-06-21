import api from './api';
import Transaction from './transaction';
import sign from './signature';
import { findChainById } from './utils/chain';
import { Wallet } from './wallet/Wallet';
import wallet from './wallet';
import addresses from './addresses';
import { EVM, IMMUTABLEX, SOLANA } from './utils/chains';

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

  async buy(order: any) {
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

  async sell(item: any, price: number | string) {
    const { contractAddress, tokenID } = item
    const contractType = item.contract.type
    const itemChainId = item.chainId

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
    return transaction.sell({ contractAddress, tokenID, contractType, price, exchangeAddress, itemChainId });
  }

  verifyMarkletplace() {
    if (!this.marketplace) {
      throw new Error('marketplace id is missing');
    }
  }

  getNFTs(options: object) {
    this.verifyMarkletplace();
    return api.tokens.getAll({ ...options, marketplace: this.marketplace });
  }

  getNFT(contractAddress: string, tokenID: number, chainId: number) {
    this.verifyMarkletplace();
    return api.tokens.get(contractAddress, tokenID, { chainId });
  }

  getListing(orderId: number) {
    return api.orders.get(orderId);
  }

  static utils = {
    findChainById
  };

  static evmTypes = {
    EVM,
    IMMUTABLEX,
    SOLANA,
  };

}

export default Nifty;