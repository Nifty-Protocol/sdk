import { EVM, IMMUTABLEX, SOLANA } from '../constants';
import { findChainById } from '../utils/chain';
import Evm from './walletProvider/evm';
import ImmutableX from './walletProvider/ImmutableX';
import Solana from './walletProvider/Solana';

const web3Libs = {
  [EVM]: Evm,
  // [IMMUTABLEX]: ImmutableX,
  // [SOLANA]: Solana,
};

export default class Wallet {
  provider;
  constructor(provider: any, type: string) {
    const web3Lib = web3Libs[type];
    if (!web3Lib) {
      throw new Error('unknown provider type');
    }
    this.provider = new web3Lib(provider);
  }
}
