// chain types

import { EVM, IMMUTABLEX, SOLANA } from '../../chains';
import Evm from './Evm';
import ImmutableX from './ImmutableX';
import Solana from './Solana';

const initWalletProvider = (provider, walletProvider) => {
  const { chainType = EVM } = provider;
  const apis = {
    [EVM]       : new Evm(walletProvider),
    [IMMUTABLEX]: new ImmutableX(walletProvider),
    [SOLANA]    : new Solana(walletProvider),
  };
  return apis[chainType];
};

export default initWalletProvider;
