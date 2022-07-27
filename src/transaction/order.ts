import addresses from '../addresses';
import {
  NULL_ADDRESS,
  ZERO,
} from '../constants';

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
  takerAddress = NULL_ADDRESS,
  makerAssetAmount,
  takerAssetAmount,
  royaltiesAddress = NULL_ADDRESS,
  expirationTimeSeconds,
  makerAssetData,
  takerAssetData,
  royaltiesAmount = ZERO,

  // makerFee = ZERO,
}) => ({
  chainId,
  exchangeAddress: addresses[chainId].Exchange,
  makerAddress,
  takerAddress,
  senderAddress: NULL_ADDRESS,
  royaltiesAddress,
  expirationTimeSeconds,
  salt: Math.round((Date.now() / 1000)),
  makerAssetAmount: makerAssetAmount.toString(),
  takerAssetAmount: takerAssetAmount.toString(),
  makerAssetData,
  takerAssetData,
  royaltiesAmount,
});


export const destructOrder = (item) => pick(item, [
  'chainId',
  'exchangeAddress',
  'makerAddress',
  'takerAddress',
  'senderAddress',
  'royaltiesAddress',
  'expirationTimeSeconds',
  'salt',
  'makerAssetAmount',
  'takerAssetAmount',
  'makerAssetData',
  'takerAssetData',
  'royaltiesAmount',
  'signature',
]);
