import EvmController from '../controllers/evmController';
import imxController from '../controllers/imxController';
import { NetworkType } from '../types/NetworkType';
import { EVM, IMMUTABLEX, SOLANA } from './chains';

const blockChainControllers = {
  [EVM]: EvmController,
  [IMMUTABLEX]: imxController,
  // [SOLANA]: Solana,
};

export default function (NetworkType: NetworkType, options: any) {
  let blockChainController = blockChainControllers[NetworkType];

  // default is evm
  if (!blockChainController) {
    return new blockChainController[EVM](options);
  }
  return new blockChainController(options);
}
