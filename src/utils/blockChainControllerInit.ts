import EvmController from '../controllers/evmController';
import imxController from '../controllers/imxController';
import { EVM, IMMUTABLEX, SOLANA } from './chains';

const flowControllers = {
  [EVM]: EvmController,
  [IMMUTABLEX]: imxController,
  // [SOLANA]: Solana,
};

export default function (type: string, options: any) {
  let flowController = flowControllers[type];

  // default is evm
  if (!flowController) {
    return new flowControllers[EVM](options);
  }
  return new flowController(options);
}
