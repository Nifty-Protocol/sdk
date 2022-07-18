import { PROD, TESTNET } from '../constants';

type env = typeof PROD | typeof TESTNET ;

export interface Options {
  key: string;
  env: env;
}
