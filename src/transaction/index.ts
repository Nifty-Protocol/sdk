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
  EIP1155,
  EIP721,
} from '../constants';
import signature from '../signature';
import addresses from '../addresses';
import { isValidERC20 } from '../utils/isValidERC20';
import { Order } from '../types/OrderInterface';

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
  * @param item - the item to buy
  */
  async buy(order: Order) {
    this.setStatus(CREATING);

    if (String(order.chainId) !== String(this.chainId)) {
      throw new Error(`Please connect to ${order.chainId}`);
    }

    const signedOrder = destructOrder(order);

    this.setStatus(APPROVING);

    const contractType = order.tokens[0].contractType;

    const { tokenAddress } = await this.contracts.decodeERC20Data(order.takerAssetData)

    if (!isValidERC20(tokenAddress, this.chainId)) {
      throw new Error("Invalid asset data");
    }

    let txHash = '';

    const nativeERC20Balance = await this.contracts.balanceOfERC20(this.address, tokenAddress);
    const proxyApprovedAllowance = await this.contracts.ERC20Allowance(tokenAddress);

    const ERC20Balance = new BigNumber(nativeERC20Balance);
    const allowance = new BigNumber(proxyApprovedAllowance);
    const itemPrice = new BigNumber(order.takerAssetAmount).plus(new BigNumber(order.takerFee));

    // if wallet has more erc20 balance than the nft price
    if (ERC20Balance.isGreaterThanOrEqualTo(itemPrice)) {
      if (allowance.isLessThan(itemPrice)) {
        this.setStatus(APPROVING);
        await this.contracts.ERC20Approve(tokenAddress);
      }
      txHash = await this.contracts.fillOrder(signedOrder);
    }

    else if (contractType === EIP721 && addresses[this.chainId].NativeERC20 === tokenAddress) {
      txHash = await this.contracts.marketBuyOrdersWithEth(signedOrder);
    }

    else if (contractType === EIP1155 && addresses[this.chainId].NativeERC20 === tokenAddress) {
      this.setStatus(CONVERT);
      await this.contracts.convertToNativeERC20(
        order.takerAssetAmount - nativeERC20Balance,
      );
      this.setStatus(APPROVING);
      if (Number(proxyApprovedAllowance) < Number(order.takerAssetAmount + order.takerFee)) {
        await this.contracts.ERC20Approve(tokenAddress);
      }
      txHash = await this.contracts.fillOrder(signedOrder);
    }

    this.setStatus(APPROVED);

    return { ...order, txHash };
  }

  async list({ contractAddress, tokenID, contractType, price, exchangeAddress, itemChainId, expirationTime, ERC20Address }) {

    if (String(itemChainId) !== String(this.chainId)) {
      throw new Error(`Please connect to ${itemChainId}`);
    }

    this.setStatus(APPROVING);

    if (contractType === EIP721) {
      await this.contracts.erc721ApproveForAll(contractAddress);
    } else if (contractType === EIP1155) {
      await this.contracts.erc1155ApproveForAll(contractAddress);
    }

    this.setStatus(SIGN);
    let makerAssetData = '';
    if (contractType === EIP721) {
      makerAssetData = await this.contracts.encodeERC721AssetData(contractAddress, tokenID);
    } else if (contractType === EIP1155) {
      makerAssetData = await this.contracts.encodeERC1155AssetData(contractAddress, tokenID, 1);
    }

    const takerAssetData = await this.contracts.encodeERC20Data(ERC20Address);

    // the amount the maker is selling of maker asset (1 ERC721 Token)
    const makerAssetAmount = new BigNumber(1);
    // the amount the maker wants of taker asset
    const unit = new BigNumber(10).pow(18);
    const baseUnitAmount = unit.times(new BigNumber(price));
    let takerAssetAmount = baseUnitAmount;

    let receiver = NULL_ADDRESS;
    let royaltyAmount = 0;

    let expirationTimeSeconds = new BigNumber(Math.round(Date.now() / 1000 + expirationTime)).toString();

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
      expirationTimeSeconds,
      makerAssetAmount,
      takerAssetAmount,
      makerAssetData,
      takerAssetData,
    });

    const signedOrder = await signature(
      this.wallet.provider.currentProvider,
      order,
      this.address,
      exchangeAddress
    );

    const { orderHash } = await this.contracts.getOrderInfo(signedOrder);

    return { ...signedOrder, orderHash };
  }

  async isOwner(contractAddress: string, tokenId: string | number, contractType: string) {

    let connectedAddressBalance;
    let tokenOwner;

    if (contractType == 'EIP1155') {
      connectedAddressBalance = await this.contracts.balanceOfERC1155(contractAddress, tokenId);
    }
    else if (contractType == 'EIP721') {
      tokenOwner = await this.contracts.getOwner(contractAddress, tokenId);
    }

    const isUserHasBalance = connectedAddressBalance > 0;
    const isUserOwner = tokenOwner.toLowerCase() === this.address.toLowerCase();

    return isUserHasBalance || isUserOwner;
  }
}
