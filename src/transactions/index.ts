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
  walletProvider: any;
  address: any;
  chainId: any;
  contracts: any;

  constructor(marketplaceId: string) {
    this.marketplaceId = marketplaceId;
  }

  async setWalletData(data) {
    this.walletProvider = data.walletProvider;
    this.address = data.address;
    this.chainId = data.chainId;
    this.contracts = new Contracts(this.walletProvider, this.address, this.chainId);
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

  async canList(contractAddress: string, tokenId: string, contractType: string) {

    let connectedAddressBalance;

    if (contractType == 'EIP1155') {
      connectedAddressBalance = await this.contracts.balanceOfERC1155(contractAddress, tokenId);
    }
    const isUserHasBalance = connectedAddressBalance > 0;
    const tokenOwner = await this.contracts.getOwner(contractAddress, tokenId);
    const isUserOwner = tokenOwner === this.address;
    return isUserHasBalance || isUserOwner;
  }
}


const transactions = (marketplaceId: string) => new Transaction(marketplaceId);

export default transactions;
