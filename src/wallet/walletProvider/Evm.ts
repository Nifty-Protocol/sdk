import addresses from '../../addresses';
import { findChainById } from '../../utils/chain';

class Evm {
  walletProvider:any;

  constructor(walletProvider) {
    this.walletProvider = walletProvider;
  }

  async getUserAddress() {
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

  async addWrappedTokenToWallet() {
    const chainId = await this.chainId();
    const tokenChain = findChainById(chainId);
    const { nativeCurrency } = tokenChain;
    let wrappedCurrencySymbol = '';
    if (nativeCurrency && nativeCurrency.symbol) {
      wrappedCurrencySymbol = nativeCurrency.wrapped;
    }

    const provider = this.walletProvider.currentProvider;
    provider.sendAsync({
      method: 'wallet_watchAsset',
      params: {
        type   : 'ERC20',
        options: {
          address : addresses[chainId].NativeERC20,
          symbol  : wrappedCurrencySymbol,
          decimals: 18,
          image   : '',
        },
      },
      id: Math.round(Math.random() * 100000),
    }, (err, added) => {
      console.log('provider returned', err, added);
    });
  }
}

export default Evm;
