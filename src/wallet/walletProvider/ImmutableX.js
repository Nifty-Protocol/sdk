import { ethers } from 'ethers';
import Web3 from 'web3';

class ImmutableX {
  constructor(walletProvider) {
    this.walletProvider = walletProvider;
  }

  async getUserAddress() {
    return localStorage.getItem('WALLET_ADDRESS');
  }

  async getId() {
    return 1996;
  }

  async chainId() {
    return 1996;
  }

  async getBalance(address) {
    const balancesRes = await this.walletProvider.currentProvider.getBalances({ user: address });
    const balanceFormatted = ethers.utils.formatEther(balancesRes.imx);
    const balance = Web3.utils.toWei(balanceFormatted);
    return balance;
  }

  humanFormatDigit(number) {
    return Web3.utils.fromWei(String(number));
  }

  blockchainFormatDigit(number) {
    return Web3.utils.toWei(String(number));
  }

  isAddress(address) {
    return Web3.utils.isAddress(address);
  }

  toHex(string) {
    return Web3.utils.toHex(string);
  }

  encode(string) {
    return Web3.utils.keccak256(string);
  }
}

export default ImmutableX;
