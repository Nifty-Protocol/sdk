import { PROD, TESTNET } from './constants';
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

  async sell(item: any, price: number | string) {

    if (!this.wallet) {
      throw new Error('Please set wallet');
    }

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
    if (!this.key) {
      throw new Error('key id is missing');
    }
  }

  getNFTs(options: object) {
    this.verifyMarkletplace();
    return this.api.tokens.getAll({ ...options, key: this.key });
  }

  getNFT(contractAddress: string, tokenID: number, chainId: number) {
    this.verifyMarkletplace();
    return this.api.tokens.get(contractAddress, tokenID, { chainId });
  }

  getGraphData(contractAddress: string, tokenID: number, id: string, chainId: number, contractType: string) {
    this.verifyMarkletplace();
    return this.api.tokens.getGraph({
      contractAddress: contractAddress,
      tokenID: tokenID,
      tokenId: id,
      chainId: chainId,
      contractType: contractType,
    })
  }
  
  getListing(orderId: number) {
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
    TESTNET
  };

}

export default Nifty;