import productionChains, { EVM } from "./chains";

export const findChainById = (id) => productionChains.find((x) => x.chainId == id) || {
  chainType: EVM, nativeCurrency: { icon: '' }, name: 'Chain is not supported.', shortName: '',
};

export const findChainNameById = (id) => findChainById(id).shortName.toLowerCase();
export const isChainEVM = (chainId) => findChainById(chainId).chainType === EVM