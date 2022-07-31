import { Wallet } from "../Wallet";
import Web3 from "web3";
import { providers } from "ethers";

class Evm implements Wallet {
  provider: providers.Provider;
  web3: any;

  constructor(provider: any) {
    this.provider = provider;
    this.web3 = new Web3(provider);
  }

  async getUserAddress(): Promise<string> {
    const accounts = await this.web3.eth.getAccounts();
    return accounts[0].toLowerCase();
  }

  async chainId(): Promise<string> {
    return this.web3.eth.getChainId();
  }

  async getBalance(address: string): Promise<string> {
    return this.web3.eth.getBalance(address);
  }

  humanFormatDigit(number) {
    return this.web3.utils.fromWei(String(number));
  }

  blockchainFormatDigit(number) {
    return this.web3.utils.toWei(String(number));
  }

  isAddress(address) {
    return this.web3.utils.isAddress(address);
  }

  toHex(string) {
    return this.web3.utils.toHex(string);
  }

  encode(string) {
    return this.web3.utils.keccak256(string);
  }

  async personalSign(hash, address, password) {
    return this.web3.eth.personal.sign(hash, address, password);
  }

  async sign(hash, address) {
    return this.web3.eth.sign(hash, address);
  }

  Contract(abi, contract) {
    return new this.web3.eth.Contract(abi, contract);
  }

  async getTransactionReceipt(txnHash) {
    return this.web3.eth.getTransactionReceipt(txnHash);
  }

  async getGasPrice() {
    return this.web3.eth.getGasPrice();
  }
}

export default Evm;
