import * as web3 from '@solana/web3.js';
import { RPC_URL } from '../../utils/solana';

// check solana on window. This is useful to fetch address of your wallet.
const getProvider = () => {
  if ('solana' in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
};

const connect = async () => {
  const provider = getProvider();
  const { publicKey } = await provider.connect();
  const connection = new web3.Connection(RPC_URL, 'confirmed');

  return { connection, publicKey };
};

class Solana {
  walletProvider:any

  constructor(walletProvider) {
    this.walletProvider = walletProvider;
  }

  async getUserAddress() {
    const { connection, publicKey } = await connect();
    const _publicKey = new web3.PublicKey(publicKey.toString());
    return _publicKey.toBase58();
  }

  async getId() {
    return 1995;
  }

  async chainId() {
    // (random fixed number) must be a number according to our api
    return 1995;
  }

  async getBalance() {
    const { connection, publicKey } = await connect();
    const _publicKey = new web3.PublicKey(publicKey.toString());
    const walletBalance = await connection.getBalance(_publicKey);
    return walletBalance;
  }

  async humanFormatDigit(number) {
    return number / web3.LAMPORTS_PER_SOL;
  }
}

export default Solana;
