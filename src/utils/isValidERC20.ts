import { currencyInterface } from "../types/currencyInterface";

export const isValidERC20 = (ERC20Contract: string, chainId: number | string, currencies: Array<currencyInterface>) => (
  currencies.find(currency => currency.address.toLowerCase() === ERC20Contract.toLowerCase() && currency.chainId === chainId))

