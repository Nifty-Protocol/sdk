import { Wallet } from "../Wallet";

class Evm implements Wallet {
  provider: any;

  constructor(provider: any) {
    this.provider = provider;
  }

  async getUserAddress(): Promise<string> {
    const accounts = await this.provider.eth.getAccounts();
    return accounts[0].toLowerCase();
  }

  async chainId(): Promise<string> {
    return this.provider.eth.getChainId();
  }

  async getBalance(address: string): Promise<string> {
    return this.provider.eth.getBalance(address);
  }

  humanFormatDigit(number) {
    return this.provider.utils.fromWei(String(number));
  }

  blockchainFormatDigit(number) {
    return this.provider.utils.toWei(String(number));
  }

  isAddress(address) {
    return this.provider.utils.isAddress(address);
  }

  toHex(string) {
    return this.provider.utils.toHex(string);
  }

  encode(string) {
    return this.provider.utils.keccak256(string);
  }

  async personalSign(hash, address, password) {
    return this.provider.eth.personal.sign(hash, address, password);
  }

  async sign(hash, address) {
    return this.provider.eth.sign(hash, address);
  }

  Contract(abi, contract) {
    return new this.provider.eth.Contract(abi, contract);
  }

  async getTransactionReceipt(txnHash) {
    return this.provider.eth.getTransactionReceipt(txnHash);
  }

  async getGasPrice() {
    return this.provider.eth.getGasPrice();
  }
}

export default Evm;
