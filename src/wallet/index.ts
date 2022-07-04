import { EVM, IMMUTABLEX, SOLANA } from '../utils/chains';
import { Wallet } from './Wallet';
import Evm from './walletProvider/evm';
import ImmutableX from './walletProvider/ImmutableX';
import Solana from './walletProvider/Solana';

const web3Libs = {
  [EVM]: Evm,
  // [IMMUTABLEX]: ImmutableX,
  // [SOLANA]: Solana,
};

export default function (type: string, provider: any): Wallet {
  const web3Lib = web3Libs[type];
  if (!web3Lib) {
    throw new Error('unknown provider type');
  }
  return new web3Lib(provider);
}
