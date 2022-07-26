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
  CHECKING_BALANCE,
  CANCELLING,
  APPROVING_FILL,
} from '../constants';
import signature from '../signature';
import { addressesParameter } from '../addresses';
import { isValidERC20 } from '../utils/isValidERC20';
import { Order } from '../types/OrderInterface';
import Emitter from '../utils/emitter';
import { findChainNameById } from '../utils/chain';

export default class Transaction {
  listener: Function;
  marketplaceId: string;
  wallet: Wallet;
  address: string;
  chainId: string;
  contracts: Contracts;
  addresses: addressesParameter;

  constructor(data) {
    this.wallet = data.wallet;
    this.address = data.address;
    this.chainId = data.chainId;
    this.addresses = data.addresses;
    this.marketplaceId = data.marketplaceId;
    this.contracts = new Contracts(this.wallet, this.address, this.chainId, data.marketplaceId);
  }


  setStatusListener(listener: Function) {
    this.listener = listener;
  }

  setStatus(status) {
    if (this.listener) {
      setTimeout(() => this.listener(status), 0);
    }
  }

  /*
     Royalties
   */
  getRoyalties(collectionAddress, tokenId, price) {
    const unit = new BigNumber(10).pow(18);
    const salePrice = unit.times(new BigNumber(price));
    return this.contracts.getRoyalties(collectionAddress, tokenId, salePrice.toString());
  }


  async buy(order: Order): Promise<Order & { txHash: any }> {
    this.setStatus(CREATING);

    if (String(order.chainId) !== String(this.chainId)) {
      throw new Error(`Please connect to ${findChainNameById(order.chainId)}`);
    }

    const signedOrder = destructOrder(order);

    this.setStatus(APPROVING);

    const { tokenAddress } = await this.contracts.decodeERC20AssetData(order.takerAssetData)

    if (!isValidERC20(tokenAddress, this.chainId)) {
      throw new Error("Invalid asset data");
    }

    let txHash = '';
    let value = '';
    
    // eth payment
    if (tokenAddress === NULL_ADDRESS) {
      value = new BigNumber(order.takerAssetAmount).toString();
    } else { // erc20 payment
      let ERC20Balance = await this.contracts.balanceOfERC20(this.address, tokenAddress);
      const proxyApprovedAllowance = await this.contracts.ERC20Allowance(tokenAddress);

      ERC20Balance = new BigNumber(ERC20Balance);
      const allowance = new BigNumber(proxyApprovedAllowance);
      const itemPrice = new BigNumber(order.takerAssetAmount);

    
      // if wallet has more erc20 balance than the nft price
      if (ERC20Balance.isGreaterThanOrEqualTo(itemPrice)) {
        if (allowance.isLessThan(itemPrice)) {
          this.setStatus(APPROVING);
          await this.contracts.ERC20Approve(tokenAddress);
        }
      }
    }

    txHash = await this.contracts.fillOrder(signedOrder, value);

    this.setStatus(APPROVED);

    return { ...order, txHash };
  }

  async list({ contractAddress, tokenID, contractType, price, exchangeAddress, itemChainId, expirationTime }) {

    if (String(itemChainId) !== String(this.chainId)) {
      throw new Error(`Please connect to ${findChainNameById(itemChainId)}`);
    }

    this.setStatus(APPROVING);

    await this.contracts.approveForAll(contractAddress, contractType)

    this.setStatus(SIGN);
    Emitter.emit('signature', () => { })

    let makerAssetData = '';
    if (contractType === EIP721) {
      makerAssetData = await this.contracts.encodeERC721AssetData(contractAddress, tokenID);
    } else if (contractType === EIP1155) {
      makerAssetData = await this.contracts.encodeERC1155AssetData(contractAddress, tokenID, 1);
    }

    const takerAssetData = await this.contracts.encodeERC20AssetData(NULL_ADDRESS);

    // the amount the maker is selling of maker asset (1 ERC721 Token)
    const makerAssetAmount = new BigNumber(1);
    // the amount the maker wants of taker asset
    const unit = new BigNumber(10).pow(18);
    const baseUnitAmount = unit.times(new BigNumber(price));
    let takerAssetAmount = baseUnitAmount;

    let receiver = NULL_ADDRESS;
    let royaltyAmount = 0;

    let expirationTimeSeconds = new BigNumber(Math.round(Date.now() / 1000 + expirationTime)).toString();

    try {
      ({ receiver, royaltyAmount } = await this.getRoyalties(contractAddress, tokenID, price));
    } catch (e) {
      console.error(e);
    }

    // takerAssetAmount = takerAssetAmount.minus(royaltyAmount);

    const order = createOrder({
      chainId: this.chainId,
      makerAddress: this.address,
      royaltiesAmount: String(royaltyAmount),
      royaltiesAddress: receiver,
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

  async offer({
    item, price, isFullConversion, expirationTime, exchangeAddress
  }) {
    this.setStatus(CREATING);
    const { contractAddress, tokenID, contractType } = item;


    if (String(item.chainId) !== String(this.chainId)) {
      throw new Error(`Please connect to ${findChainNameById(item.chainId)}`);
    }

    this.setStatus(CHECKING_BALANCE);

    const userBalance = await this.wallet.getBalance(this.address);
    const nativeERC20Balance = await this.contracts.balanceOfNativeERC20();
    const priceInWei = this.wallet.blockchainFormatDigit(price);

    let depositTxHash;
    const minConversion = new BigNumber(priceInWei).minus(nativeERC20Balance);
    const maxConversion = new BigNumber(priceInWei);
    const balanceConversion = new BigNumber(userBalance);
    let conversion = new BigNumber(0);


    if (isFullConversion) {
      conversion = maxConversion;
      if (conversion.isGreaterThan(balanceConversion)) {
        const gasPrice = await this.wallet.provider.eth.getGasPrice();
        const gas = await this.contracts.deposit().estimateGas({ gasPrice });
        conversion = balanceConversion.minus(gas * gasPrice * 5);
      }
    } else {
      conversion = minConversion;
    }

    if (conversion > new BigNumber(0)) {
      this.setStatus(CONVERT);
      depositTxHash = await this.contracts.convertToNativeERC20(conversion);
    }

    const proxyApprovedAllowance = await this.contracts.NativeERC20Allowance();

    if (Number(proxyApprovedAllowance) < Number(priceInWei)) {
      this.setStatus(APPROVING);
      const approveTxHash = await this.contracts.NativeERC20Approve();
    }

    this.setStatus(SIGN);
    Emitter.emit('signature', () => { })

    let takerAssetData = '';
    if (contractType === EIP721) {
      takerAssetData = await this.contracts.encodeERC721AssetData(contractAddress, tokenID);
    } else if (contractType === EIP1155) {
      takerAssetData = await this.contracts.encodeERC1155AssetData(contractAddress, tokenID, 1);
    }

    const makerAssetData = await this.contracts.encodeERC20AssetData();

    // the amount the maker is selling of maker asset (1 ERC721 Token)
    const takerAssetAmount = new BigNumber(1);
    // the amount the maker wants of taker asset
    const unit = new BigNumber(10).pow(18);
    const baseUnitAmount = unit.times(new BigNumber(price));
    let makerAssetAmount = baseUnitAmount;

    let receiver = NULL_ADDRESS;
    let royaltyAmount = 0;
    let expirationTimeSeconds = new BigNumber(Math.round(Date.now() / 1000 + expirationTime)).toString();

    try {
      ({ receiver, royaltyAmount } = await this.getRoyalties(contractAddress, tokenID, price));
    } catch (e) {
      console.error(e);
    }

    makerAssetAmount = makerAssetAmount.minus(royaltyAmount);

    const order = createOrder({
      chainId: this.chainId,
      makerAddress: this.address,
      royaltiesAmount: String(royaltyAmount),
      royaltiesAddress: receiver,
      expirationTimeSeconds,
      makerAssetAmount,
      takerAssetAmount,
      makerAssetData,
      takerAssetData,
    });

    order.chainId = String(order.chainId);

    // Generate the order hash and sign it
    const signedOrder = await signature(
      this.wallet.provider.currentProvider,
      order,
      this.address,
      exchangeAddress
    );

    const { orderHash } = await this.contracts.getOrderInfo(signedOrder);

    this.setStatus(APPROVED);

    return { ...signedOrder, orderHash };
  }

  async acceptOffer(order: Order): Promise<Order & { txHash: any }> {
    const nativeERC20Balance = await this.contracts.balanceOfNativeERC20(order.makerAddress);

    if (new BigNumber(order.makerAssetAmount).isGreaterThan(nativeERC20Balance)) {
      throw new Error('Not enough balance');
    }

    this.setStatus(CREATING);
    const signedOrder = destructOrder(order);

    const { tokens } = order;

    this.setStatus(APPROVING);

    await Promise.all(
      tokens.map(
        async (token) => {
          const { contract } = token;
          const { type, address } = contract;

          await this.contracts.approveForAll(address, type)
        },
      ),
    );

    this.setStatus(APPROVING_FILL);

    const txHash = await this.contracts.fillOrder(signedOrder);

    this.setStatus(APPROVED);

    return { ...order, txHash };
  }

  async cancelOrder(order: Order) {
    const signedOrder = destructOrder(order);
    this.setStatus(CANCELLING);
    await this.contracts.cancelOrder(signedOrder);
  }


  async isOwner(contractAddress: string, tokenId: string | number, contractType: string) {

    let connectedAddressBalance;
    let tokenOwner;
    let isUserOwner;

    if (contractType == EIP1155) {
      connectedAddressBalance = await this.contracts.balanceOfERC1155(contractAddress, tokenId);
    }
    else if (contractType == EIP721) {
      tokenOwner = await this.contracts.getOwner(contractAddress, tokenId);
      isUserOwner = tokenOwner.toLowerCase() === this.address.toLowerCase();
    }

    const isUserHasBalance = connectedAddressBalance > 0;

    return isUserHasBalance || isUserOwner;
  }

 
}