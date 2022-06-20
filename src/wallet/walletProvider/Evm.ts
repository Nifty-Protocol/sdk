class Evm {
  walletProvider:any;

  constructor(walletProvider) {
    this.walletProvider = walletProvider;
  }

  async getUserAddress() {
    console.log(this.walletProvider);
    debugger;
    const accounts = await this.walletProvider.eth.getAccounts();
    return accounts[0].toLowerCase();
  }

  async getId() {
    return this.walletProvider.eth.net.getId();
  }

  async chainId() {
    return this.walletProvider.eth.getChainId();
  }

  async getBalance(address) {
    return this.walletProvider.eth.getBalance(address);
  }

  humanFormatDigit(number) {
    return this.walletProvider.utils.fromWei(String(number));
  }

  blockchainFormatDigit(number) {
    return this.walletProvider.utils.toWei(String(number));
  }

  isAddress(address) {
    return this.walletProvider.utils.isAddress(address);
  }

  toHex(string) {
    return this.walletProvider.utils.toHex(string);
  }

  encode(string) {
    return this.walletProvider.utils.keccak256(string);
  }

  async personalSign(hash, address, password) {
    return this.walletProvider.eth.personal.sign(hash, address, password);
  }

  async sign(hash, address) {
    return this.walletProvider.eth.sign(hash, address);
  }

  Contract(abi, contract) {
    return new this.walletProvider.eth.Contract(abi, contract);
  }

  async getTransactionReceipt(txnHash) {
    return this.walletProvider.eth.getTransactionReceipt(txnHash);
  }

  async getGasPrice() {
    return this.walletProvider.eth.getGasPrice();
  }
}

export default Evm;
