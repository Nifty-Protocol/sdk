import orders from './orders';
import tokens from './tokens';
import trades from './trades';
import config from '../config';

export default function(env) {
  const base = config.api[env];
  if (!base) {
    throw new Error('unknown env');
  }
  return {
    orders: orders(base),
    tokens: tokens(base),
    trades: trades(base),
  }
};
