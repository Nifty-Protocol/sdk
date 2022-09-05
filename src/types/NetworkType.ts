import { EVM, IMMUTABLEX, SOLANA } from "../utils/chains";

export type NetworkType = typeof EVM | typeof IMMUTABLEX | typeof SOLANA;
