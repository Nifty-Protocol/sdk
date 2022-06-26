import BigNumber from 'bignumber.js';
import addresses from '../addresses';
import {
  MAX_DIGITS_IN_UNSIGNED_256_INT,
  tenYearsInSeconds,
  NULL_ADDRESS,
  NULL_BYTES,
  ZERO,
} from '../constants';
import web3 from 'web3';

export const generatePseudoRandom256BitNumber = () => {
  const randomNumber = BigNumber.random(MAX_DIGITS_IN_UNSIGNED_256_INT);
  const factor = new BigNumber(10).pow(MAX_DIGITS_IN_UNSIGNED_256_INT - 1);
  const randomNumberScaledTo256Bits = randomNumber.times(factor).integerValue();
  return randomNumberScaledTo256Bits;
};

const pick = (obj, props) => {
  const picked = {};
  props.forEach((prop) => {
    picked[prop] = obj[prop];
  });
  return picked;
};

export const createOrder = ({
  chainId,
  makerAddress,
  makerAssetAmount,
  takerAssetAmount,
  makerAssetData,
  takerAssetData,
  takerAddress = NULL_ADDRESS,
  feeRecipientAddress = NULL_ADDRESS,
  expirationTimeSeconds,
  makerFee = ZERO,
  takerFee = ZERO,
}) => ({
  chainId,
  exchangeAddress: addresses[chainId].Exchange,
  makerAddress,
  takerAddress,
  senderAddress: NULL_ADDRESS,
  feeRecipientAddress,
  expirationTimeSeconds,
  salt: web3.utils.randomHex(32),
  makerAssetAmount: makerAssetAmount.toString(),
  takerAssetAmount: takerAssetAmount.toString(),
  makerAssetData,
  takerAssetData,
  makerFeeAssetData: makerAssetData,
  takerFeeAssetData: takerAssetData,
  makerFee: makerFee.toString(),
  takerFee: takerFee.toString(),
});

export const destructOrder = (item) => pick(item, [
  'chainId',
  'exchangeAddress',
  'makerAddress',
  'takerAddress',
  'senderAddress',
  'feeRecipientAddress',
  'expirationTimeSeconds',
  'salt',
  'makerAssetAmount',
  'takerAssetAmount',
  'makerAssetData',
  'takerAssetData',
  'makerFeeAssetData',
  'takerFeeAssetData',
  'makerFee',
  'takerFee',
  'signature',
]);
