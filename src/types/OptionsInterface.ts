import { PROD, TESTNET, LOCAL } from '../constants';

type env = typeof PROD | typeof TESTNET | typeof LOCAL;

export interface Options {
  key: string;
  env: env;
}
