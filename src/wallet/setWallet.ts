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

const initWeb3 = (provider: any) => {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: void web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
};

export const setWallet = async (provider: any, providerType: providerTypes) => {
  const walletProvider = initWalletProvider(providerType, initWeb3(provider));
  const address = await walletProvider.getUserAddress();
  const networkId = await walletProvider.getId();
  const chainId = await walletProvider.chainId();
  const { chainType } = findChainById(chainId);
  const balance = await walletProvider.getBalance(address);

  return {
    networkId, chainId, walletProvider, provider, address, balance, chainType,
  };
}