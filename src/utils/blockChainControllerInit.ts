import EvmController from '../controllers/evmController';
import imxController from '../controllers/imxController';
import { EVM, IMMUTABLEX, SOLANA } from './chains';

const blockChainControllers = {
  [EVM]: EvmController,
  [IMMUTABLEX]: imxController,
  // [SOLANA]: Solana,
};

export default function (type: string, options: any) {
  let blockChainController = blockChainControllers[type];

  // default is evm
  if (!blockChainController) {
    return new blockChainController[EVM](options);
  }
  return new blockChainController(options);
}
