import { PROD, TESTNET } from '../constants';

export type env = typeof PROD | typeof TESTNET ;

export interface Options {
  key: string;
  env: env;
  endPoint: string;
}
