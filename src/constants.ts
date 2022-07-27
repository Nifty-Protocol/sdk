import BigNumber from 'bignumber.js';

export const PROD = 'prod';
export const TESTNET = 'testnet';

export const SIGNATURE_DOMAIN = 'Nifty Exchange';
export const SIGNATURE_VERSION = '2.0';

export const CREATING = 'creating';
export const CREATING_GASLESS = 'creating_gasless';
export const APPROVING = 'approving';
export const APPROVED = 'approved';
export const SIGN = 'sign';
export const APPROVING_FILL = 'approving_fill';
export const CHECKING_BALANCE = 'checking_balance';
export const CONVERT = 'convert';
export const BUY = 'buy';
export const SELL = 'sell';
export const STAKING = 'staking';
export const CLAIM = 'claim';
export const WITHDRAW = 'withdraw';
export const PURCHASE = 'purchase';
export const CANCELLING = 'cancelling';
export const OFFER = 'OFFER';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const NULL_BYTES = '0x';
export const ZERO = new BigNumber(0).toString();

export const tenYearsInSeconds = new BigNumber(Math.round((Date.now() / 1000) + 315569520)).toString();
export const MAX_DIGITS_IN_UNSIGNED_256_INT = 78;

export const OPENSEA = 'OPENSEA';
export const LOOKSRARE = 'LOOKSRARE';
export const RARIBLE = 'RARIBLE';

export const EIP721 = 'EIP721';
export const EIP1155 = 'EIP1155';

export const defaultKey = '0x6fbb00c559133cbeb2c88ed6728bb152df3d622f5faaf7077a9a9c6b54c16157';

export const orderStatuses = {
  ADDED: 'ADDED',
  FILLED: 'FILLED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  INVALID: 'INVALID',
};