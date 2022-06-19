import { SOLANA } from './chains';

// TODO: export to env
export const RPC_URL = 'https://api.devnet.solana.com';
export const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

const currentKey = '';

const getProvider = () => {
  if ('solana' in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
};

const connectPhantom = async () => {
  const provider = getProvider();
  const { publicKey } = await provider.connect();
  return { ...provider, publicKey, chainType: SOLANA };
};

export default connectPhantom;
