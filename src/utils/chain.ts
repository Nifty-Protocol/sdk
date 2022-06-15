import productionChains, { EVM } from "./chains";

export const findChainById = (id) => productionChains.find((x) => x.chainId == id) || {
  chainType: EVM, nativeCurrency: { icon: '' }, name: 'Chain is not supported.', shortName: '',
};