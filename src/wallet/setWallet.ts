import Web3 from 'web3';
import { EVM, IMMUTABLEX, SOLANA } from '../constants';
import { findChainById } from '../utils/chain';
// import Evm from './Evm';
import Evm from '../wallet/walletProvider/evm';
import ImmutableX from '../wallet/walletProvider/ImmutableX';
import Solana from '../wallet/walletProvider/Solana';

export type providerTypes = 'EVM' | 'immutablex' | 'solana';

const initWalletProvider = (providerType: providerTypes, walletProvider: any) => {
  const apis = {
    [EVM]: new Evm(walletProvider),
    [IMMUTABLEX]: new ImmutableX(walletProvider),
    [SOLANA]: new Solana(walletProvider),
  };
  return apis[providerType];
};
export const setWallet = async (_walletProvider: any, providerType: providerTypes) => {
  const walletProvider = initWalletProvider(providerType, _walletProvider);
  const address = await walletProvider.getUserAddress();
  const networkId = await walletProvider.getId();
  const chainId = await walletProvider.chainId();
  const { chainType } = findChainById(chainId);
  const balance = await walletProvider.getBalance(address);

  return {
    networkId, chainId, walletProvider, address, balance, chainType,
  };
}