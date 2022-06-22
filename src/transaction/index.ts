import { Wallet } from '../wallet/Wallet';
import BigNumber from 'bignumber.js';
import Contracts from './contracts';
import { createOrder, destructOrder } from './order';
import {
  CREATING,
  APPROVING,
  APPROVED,
  CONVERT,
  SIGN,
  NULL_ADDRESS,
} from '../constants';
import signature from '../signature';

export default class Transaction {
  listener: Function;
  marketplaceId: string;
  wallet: Wallet;
  address: string;
  chainId: string;
  contracts: Contracts;

  constructor(data) {
    this.wallet = data.wallet;
    this.address = data.address;
    this.chainId = data.chainId;
    this.contracts = new Contracts(this.wallet, this.address, this.chainId);
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

  async sell({ contractAddress, tokenID, contractType, price, exchangeAddress, itemChainId }) {

    if (String(itemChainId) !== String(this.chainId)) {
      throw new Error(`Please connect to ${itemChainId}`);
    }

    this.setStatus(APPROVING);

    if (contractType === 'EIP721') {
      await this.contracts.erc721ApproveForAll(contractAddress);
    } else if (contractType === 'EIP1155') {
      await this.contracts.erc1155ApproveForAll(contractAddress);
    }

    this.setStatus(SIGN);
    let makerAssetData = '';
    if (contractType === 'EIP721') {
      makerAssetData = await this.contracts.encodeERC721AssetData(contractAddress, tokenID);
    } else if (contractType === 'EIP1155') {
      makerAssetData = await this.contracts.encodeERC1155AssetData(contractAddress, tokenID, 1);
    }

    const takerAssetData = await this.contracts.encodeERC20AssetData();

    // the amount the maker is selling of maker asset (1 ERC721 Token)
    const makerAssetAmount = new BigNumber(1);
    // the amount the maker wants of taker asset
    const unit = new BigNumber(10).pow(18);
    const baseUnitAmount = unit.times(new BigNumber(price));
    let takerAssetAmount = baseUnitAmount;

    let receiver = NULL_ADDRESS;
    let royaltyAmount = 0;

    // try {
    //   ({ receiver, royaltyAmount } = await this.getRoyalties(contractAddress, tokenID, price));
    // } catch (e) {
    //   console.error(e);
    // }

    takerAssetAmount = takerAssetAmount.minus(royaltyAmount);

    const order = createOrder({
      chainId: this.chainId,
      makerAddress: this.address,
      takerFee: String(royaltyAmount),
      feeRecipientAddress: receiver,
      makerAssetAmount,
      takerAssetAmount,
      makerAssetData,
      takerAssetData,
    });

    const signedOrder = await signature(
      this.wallet.provider,
      order,
      this.address,
      exchangeAddress
    );

    const { orderHash } = await this.contracts.getOrderInfo(signedOrder);

    return { ...signedOrder, orderHash };
  }

  async isOwner(contractAddress: string, tokenId: number, contractType: string) {

    let connectedAddressBalance;
    let tokenOwner;

    if (contractType == 'EIP1155') {
      connectedAddressBalance = await this.contracts.balanceOfERC1155(contractAddress, tokenId);
    }
    else if (contractType == 'EIP721') {
      tokenOwner = await this.contracts.getOwner(contractAddress, tokenId);
    }

    const isUserHasBalance = connectedAddressBalance > 0;
    const isUserOwner = tokenOwner === this.address;
    return isUserHasBalance || isUserOwner;
  }
}
