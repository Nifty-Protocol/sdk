import BigNumber from 'bignumber.js';
import Contracts from './contracts';
import { createOrder, destructOrder } from './order';
import {
  CREATING,
  APPROVING,
  APPROVED,
  CONVERT,
} from '../constants';

class Transaction {
  listener: Function;
  marketplaceId: string;
  web3: any;
  provider: any;
  address: any;
  chainId: any;
  contracts: any;
  constructor(marketplaceId: string) {
    this.marketplaceId = marketplaceId;
  }
  async setWeb3(web3) {
    this.web3 = web3;
    this.provider = web3.getCurrentProvider;
    const accounts = await web3.eth.getAccounts();
    this.address = accounts[0].toLowerCase();
    this.chainId = await web3.eth.chainId();
    this.contracts = new Contracts(this.web3, this.address, this.chainId);
  }

  setStatusListener(listener: Function) {
    this.listener = listener;
  }

  setStatus(status) {
    if (this.listener) {
      setTimeout(() => this.listener(status), 0);
    }
  }
  /**
   * BUY
   * @param {array} items
   */
  async buy(item) {
    this.setStatus(CREATING);

    if (String(item.chainId) !== String(this.chainId)) {
      throw new Error(`Please connect to ${item.chainId}`);
    }

    const signedOrder = destructOrder(item);

    this.setStatus(APPROVING);

    const contractType = item.tokens[0].contract.type;

    let txHash = '';

    const nativeERC20Balance = await this.contracts.balanceOfNativeERC20();
    const proxyApprovedAllowance = await this.contracts.NativeERC20Allowance();

    const ERC20Balance = new BigNumber(nativeERC20Balance);
    const allowance = new BigNumber(proxyApprovedAllowance);
    const itemPrice = new BigNumber(item.takerAssetAmount).plus(new BigNumber(item.takerFee));

    // if wallet has more erc20 balance than the nft price
    if (ERC20Balance.isGreaterThanOrEqualTo(itemPrice)) {
      if (allowance.isLessThan(itemPrice)) {
        this.setStatus(APPROVING);
        await this.contracts.NativeERC20Approve();
      }
      txHash = await this.contracts.fillOrder(signedOrder);
    } else if (contractType === 'EIP721') {
      txHash = await this.contracts.marketBuyOrdersWithEth(signedOrder);
    } else if (contractType === 'EIP1155') {
      this.setStatus(CONVERT);
      await this.contracts.convertToNativeERC20(
        item.takerAssetAmount - nativeERC20Balance,
      );
      this.setStatus(APPROVING);
      if (Number(proxyApprovedAllowance) < Number(item.takerAssetAmount + item.takerFee)) {
        await this.contracts.NativeERC20Approve();
      }
      txHash = await this.contracts.fillOrder(signedOrder);
    }

    this.setStatus(APPROVED);

    return { ...item, txHash };
  }
}

const transactions = (marketplaceId: string) => new Transaction(marketplaceId);

export default transactions;
