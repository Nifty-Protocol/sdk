import { Wallet } from "../Wallet";

class Evm implements Wallet {
  provider: any;

  constructor(provider: any) {
    this.provider = provider;
  }

  async getUserAddress(): Promise<string> {
    const accounts = await this.provider.walletProvider.eth.getAccounts();
    return accounts[0].toLowerCase();
  }

  async chainId(): Promise<string> {
    return this.provider.walletProvider.eth.getChainId();
  }

  async getBalance(address: string): Promise<string> {
    return this.provider.walletProvider.eth.getBalance(address);
  }

  humanFormatDigit(number) {
    return this.provider.walletProvider.utils.fromWei(String(number));
  }

  blockchainFormatDigit(number) {
    return this.provider.walletProvider.utils.toWei(String(number));
  }

  isAddress(address) {
    return this.provider.walletProvider.utils.isAddress(address);
  }

  toHex(string) {
    return this.provider.walletProvider.utils.toHex(string);
  }

  encode(string) {
    return this.provider.walletProvider.utils.keccak256(string);
  }

  async personalSign(hash, address, password) {
    return this.provider.walletProvider.eth.personal.sign(hash, address, password);
  }

  async sign(hash, address) {
    return this.provider.walletProvider.eth.sign(hash, address);
  }

  Contract(abi, contract) {
    return new this.provider.walletProvider.eth.Contract(abi, contract);
  }

  async getTransactionReceipt(txnHash) {
    return this.provider.walletProvider.eth.getTransactionReceipt(txnHash);
  }

  async getGasPrice() {
    return this.provider.walletProvider.eth.getGasPrice();
  }
}

export default Evm;
