import EvmController from '../Controllers/evmController';
import imxController from '../Controllers/imxController';
import { EVM, IMMUTABLEX, SOLANA } from '../utils/chains';

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
