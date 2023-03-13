import { Client, dropsToXrp, xrpToDrops } from 'xrpl';

class Xrpl {
  walletProvider:any
  
  constructor(walletProvider) {
    this.walletProvider = walletProvider;
  }

  async getUserAddress() {
    return this.walletProvider.user.account;
  }

  async getId() {
    return this.walletProvider.chainId;
  }

  async chainId() {
    return this.walletProvider.chainId;
  }

  async getBalance(address) {
    const options = {
      command     : 'account_info',
      account     : address,
      strict      : true,
      ledger_index: 'current',
      queue       : true,
    };
    const client = new Client(this.walletProvider.user.networkEndpoint);
    await client.connect();

    try {
      const info: any = await client.request(options);
      return info?.result?.account_data?.Balance;
    } catch (e) {
      console.error(e);
      return 0;
    }
  }

  humanFormatDigit(number) {
    return dropsToXrp(String(number));
  }

  blockchainFormatDigit(number) {
    return xrpToDrops(String(number));
  }
}

export default Xrpl;
