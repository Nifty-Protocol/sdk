import currencies from "./currencies";

export const isValidERC20 = (ERC20Contract, chainId) => (currencies.find(currency => currency.address.toLowerCase() === ERC20Contract.toLowerCase() && currency.chainId === chainId))

