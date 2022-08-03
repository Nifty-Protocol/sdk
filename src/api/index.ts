import orders from './orders';
import tokens from './tokens';
import trades from './trades';
import externalOrders from './externalOrders';
import config from '../config';
import contracts from './contracts';

export default function (env, endPoint: string | null = null) {
  let base: string;

  if (endPoint) {
    base = endPoint
  } else {
    base = config.api[env];
  }

  if (!base) {
    throw new Error('unknown env');
  }
  return {
    externalOrders: externalOrders(base),
    orders: orders(base),
    tokens: tokens(base),
    trades: trades(base),
    contracts: contracts(base),
  }
};
