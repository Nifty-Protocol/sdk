import { PROD, TESTNET } from './constants';
import { findChainById } from './utils/chain';
import { EVM, IMMUTABLEX, SOLANA } from './utils/chains';
import { Options } from './types/OptionsInterface';
import transactionConfirmation from './utils/transactionConfirmation';
import { NiftyEvm } from './niftyEVM';
import { NiftyImx } from './niftyImx';
import { NiftyBase } from './niftyBase';

export class Nifty extends NiftyBase {
  constructor(options: Options) {
    super(options);
    const envTypes = {
      [EVM]: NiftyEvm,
      [IMMUTABLEX]: NiftyImx,
      // [SOLANA]: Solana,
    };

    if (options.networkType) {
      const envType = envTypes[options.networkType];
      if (!envType) {
        throw new Error('unknown network type type');
      }
      return new envType(options);
    }
  }

  static utils = {
    findChainById,
    transactionConfirmation
  };

  static networkTypes = {
    EVM,
    IMMUTABLEX,
    SOLANA,
  };

  static envs = {
    PROD,
    TESTNET,
  };

}
