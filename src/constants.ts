import BigNumber from 'bignumber.js';

export const PROD = 'prod';
export const TESTNET = 'testnet';

export const SIGNATURE_DOMAIN = 'NiftyProtocol';
export const SIGNATURE_VERSION = '2.0.0';

export const CREATING = 'creating';
export const CREATING_GASLESS = 'creating_gasless';
export const APPROVING = 'approving';
export const APPROVED = 'approved';
export const SIGN = 'sign';
export const APPROVING_FILL = 'approving_fill';
export const CHECKING_BALANCE = 'checking_balance';
export const CONVERT = 'convert';
export const BUY = 'buy';
export const STAKING = 'staking';
export const CLAIM = 'claim';
export const WITHDRAW = 'withdraw';
export const PURCHASE = 'purchase';
export const CANCELLING = 'cancelling';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const NULL_BYTES = '0x';
export const ZERO = new BigNumber(0).toString();

export const tenYearsInSeconds = new BigNumber(Date.now() + 315569520).toString();
export const MAX_DIGITS_IN_UNSIGNED_256_INT = 78;

