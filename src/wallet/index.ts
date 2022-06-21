import { EVM, IMMUTABLEX, SOLANA } from '../constants';
import { findChainById } from '../utils/chain';
import { Wallet } from './Wallet';
import Evm from './walletProvider/evm';
import ImmutableX from './walletProvider/ImmutableX';
import Solana from './walletProvider/Solana';

const web3Libs = {
  [EVM]: Evm,
  // [IMMUTABLEX]: ImmutableX,
  // [SOLANA]: Solana,
};

export default function (provider: any, type: string): Wallet {
  const web3Lib = web3Libs[type];
  if (!web3Lib) {
    throw new Error('unknown provider type');
  }
  return new web3Lib(provider);
}
