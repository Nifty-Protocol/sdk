import BigNumber from 'bignumber.js';
import Contracts from './contracts';
import { createOrder, destructOrder } from './order';
import {
  CREATING,
  APPROVING,
  APPROVED,
  CONVERT,
} from '../constants';

export default class Transaction {
  listener: Function;
  web3: any;
  provider: any;
  address: any;
  networkId: any;
  chainId: any;
  contracts: any;
  constructor({
    web3, provider, address, networkId, chainId,
  }) {
    this.web3 = web3;
    this.provider = provider;
    this.address = address.toLowerCase();
    this.networkId = networkId;
    this.chainId = chainId;
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

    const signedOrder = destructOrder(item);

    this.setStatus(APPROVING);

    const contractType = item.tokens[0].contract.type;

    let txHash = '';

    const nativeERC20Balance = await this.contracts.balanceOfNativeERC20();
    const proxyApprovedAllowance = await this.contracts.NativeERC20Allowance();

    const ERC20Balance = new BigNumber(nativeERC20Balance);
    const allowance = new BigNumber(proxyApprovedAllowance);
    const itemPrice = new BigNumber(item.takerAssetAmount).plus(new BigNumber(item.takerFee));

    if (ERC20Balance.isGreaterThanOrEqualTo(itemPrice)) {
      if (allowance.isLessThan(itemPrice)) {
        this.setStatus(APPROVING);
        await this.contracts.NativeERC20Approve();
      }
      txHash = await this.contracts.fillOrder(signedOrder);
    } else if (contractType === 'EIP721') {
      let greePayFeeWei = 0;
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
