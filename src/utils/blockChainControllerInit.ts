import EvmController from '../controllers/evmController';
import ImxController from '../controllers/imxController';
import XrplController from '../controllers/xrplController';
import { NetworkType } from '../types/NetworkType';
import { EVM, IMMUTABLEX, SOLANA, XRPL } from './chains';

const blockChainControllers = {
  [EVM]: EvmController,
  [IMMUTABLEX]: ImxController,
  // [SOLANA]: Solana,
  [XRPL]: XrplController,
};

export default function (NetworkType: NetworkType, options: any) {
  let blockChainController = blockChainControllers[NetworkType];

  // default is evm
  if (!blockChainController) {
    return new blockChainController[EVM](options);
  }
  return new blockChainController(options);
}
