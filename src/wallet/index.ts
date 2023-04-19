import { EVM, IMMUTABLEX, SOLANA, XRPL } from '../utils/chains';
import { Wallet } from '../types/Wallet';
import Evm from './walletProvider/evm';
import ImmutableX from './walletProvider/ImmutableX';
import Solana from './walletProvider/Solana';
import Xrpl from './walletProvider/Xrpl';

const web3Libs = {
  [EVM]: Evm,
  [IMMUTABLEX]: ImmutableX,
  [XRPL]: Xrpl,
  // [SOLANA]: Solana,
};

export default function (type: string, provider: any): Wallet {
  const web3Lib = web3Libs[type];
  if (!web3Lib) {
    throw new Error('unknown provider type');
  }
  return new web3Lib(provider);
}
