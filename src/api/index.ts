import orders from './orders';
import tokens from './tokens';
import trades from './trades';
import externalOrders from './externalOrders';
import config from '../config';

export default function(env) {
  const base = config.api[env];
  if (!base) {
    throw new Error('unknown env');
  }
  return {
    externalOrders: externalOrders(base),
    orders: orders(base),
    tokens: tokens(base),
    trades: trades(base),
  }
};
