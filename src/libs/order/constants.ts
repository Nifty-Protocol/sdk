import BigNumber from 'bignumber.js';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const NULL_BYTES = '0x';
export const ZERO = new BigNumber(0).toString();

export const tenYearsInSeconds = new BigNumber(Date.now() + 315569520).toString();
export const MAX_DIGITS_IN_UNSIGNED_256_INT = 78;
