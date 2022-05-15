import { signatureUtils } from 'signature-utils';
import BigNumber from 'bignumber.js';
import { toBuffer } from 'ethereumjs-util';
import Contracts from './contracts';
import { createOrder, destructOrder } from './order';
import { signTyped } from './signature';
/* import {
  CREATING,
  APPROVING,
  SIGN,
  APPROVED,
  CHECKING_BALANCE,
  CONVERT,
  APPROVING_FILL,
} from '../transaction-actions'; */
import api from '../api';
import { findChainById } from '../chain';
import { NULL_ADDRESS } from './constants';
import chains from '../../chains';
import { checkIfNativeSupport } from '../etherUtils';

export default class Transaction {
  listener: Function;
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

  /*
    Royalties
  */

  getRoyalties(
    collectionAddress,
    tokenId,
    price,
  ) {
    const unit = new BigNumber(10).pow(18);
    const salePrice = unit.times(new BigNumber(price));
    return this.contracts.getRoyalties(collectionAddress, tokenId, salePrice.toString());
  }

  getRoyaltiesSplit(
    address,
  ) {
    return this.contracts.getRoyaltiesSplit(address);
  }

  getTokenRoyaltyBalance(
    tokenID,
    contractAddress,
  ) {
    return this.contracts.getTokenRoyaltyBalance(tokenID, contractAddress);
  }

  async claimCommunityBatch(
    tokenIDs,
    contractAddress,
  ) {
    this.setStatus(SIGN);
    const res = await this.contracts.claimCommunityBatch(tokenIDs, contractAddress);
    this.setStatus(APPROVED);
    return res;
  }

  /**
   * SELL
   * @param {array} items
   */
  async sell(item, price) {
    this.setStatus(CREATING);

    const { contractAddress, tokenID, contractType } = item;

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

    try {
      ({ receiver, royaltyAmount } = await this.getRoyalties(contractAddress, tokenID, price));
    } catch (e) {
      console.error(e);
    }
    takerAssetAmount = takerAssetAmount.minus(royaltyAmount);
    const order = createOrder({
      chainId            : this.chainId,
      makerAddress       : this.address,
      takerFee           : royaltyAmount,
      feeRecipientAddress: receiver,
      makerAssetAmount,
      takerAssetAmount,
      makerAssetData,
      takerAssetData,
    });

    // signedOrder = await signatureUtils.ecSignOrderAsync(
    //   this.provider,
    //   order,
    //   this.address,
    // );

    order.chainId = String(order.chainId);

    const signedOrder = await signTyped(
      this.provider,
      order,
      this.address,
    );

    const { orderHash } = await this.contracts.getOrderInfo(signedOrder);

    this.setStatus(APPROVED);

    return { ...signedOrder, orderHash };
  }

  /**
   * BUY
   * @param {array} items
   */
  async buy(item, isGreenPay) {
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
    const chain = findChainById(item.chainId);
    const nativeSupported = checkIfNativeSupport(chain);

    if (!isGreenPay && (ERC20Balance.isGreaterThanOrEqualTo(itemPrice) || !nativeSupported)) {
      if (allowance.isLessThan(itemPrice)) {
        this.setStatus(APPROVING);
        await this.contracts.NativeERC20Approve();
      }
      txHash = await this.contracts.fillOrder(signedOrder);
    } else if (contractType === 'EIP721' && nativeSupported) {
      let greePayFeeWei = 0;
      if (isGreenPay) {
        const { greenPayFee } = chains.find((x) => x.chainId == this.chainId);
        greePayFeeWei = this.web3.utils.toWei(String(greenPayFee));
      }
      txHash = await this.contracts.marketBuyOrdersWithEth(signedOrder, isGreenPay, greePayFeeWei);
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

  /**
   * CONVERT TO WETH
   * @param {array} items
   */
  async offer({
    item, price, isFullConversion,
  }) {
    this.setStatus(CREATING);

    const { contractAddress, tokenID, contractType } = item;

    this.setStatus(CHECKING_BALANCE);

    const userBalance = await this.web3.eth.getBalance(this.address);
    const nativeERC20Balance = await this.contracts.balanceOfNativeERC20();
    const priceInWei = this.web3.utils.toWei(String(price));
    let depositTxHash;
    const minConversion = BigNumber(priceInWei).minus(nativeERC20Balance);
    const maxConversion = BigNumber(priceInWei);
    const balanceConversion = BigNumber(userBalance);
    let conversion = 0;
    if (isFullConversion) {
      conversion = maxConversion;
      if (conversion.isGreaterThan(balanceConversion)) {
        const gasPrice = await this.web3.eth.getGasPrice();
        const gas = await this.contracts.deposit().estimateGas({ gasPrice });
        conversion = balanceConversion.minus(gas * gasPrice * 5);
      }
    } else {
      conversion = minConversion;
    }
    if (conversion > 0) {
      this.setStatus(CONVERT);
      depositTxHash = await this.contracts.convertToNativeERC20(conversion);
    }

    const proxyApprovedAllowance = await this.contracts.NativeERC20Allowance();

    if (Number(proxyApprovedAllowance) < Number(priceInWei)) {
      this.setStatus(APPROVING);
      const approveTxHash = await this.contracts.NativeERC20Approve();
    }

    this.setStatus(SIGN);

    let takerAssetData = '';
    if (contractType === 'EIP721') {
      takerAssetData = await this.contracts.encodeERC721AssetData(contractAddress, tokenID);
    } else if (contractType === 'EIP1155') {
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

    try {
      ({ receiver, royaltyAmount } = await this.getRoyalties(contractAddress, tokenID, price));
    } catch (e) {
      console.error(e);
    }
    makerAssetAmount = makerAssetAmount.minus(royaltyAmount);
    const order = createOrder({
      chainId            : this.chainId,
      makerAddress       : this.address,
      makerFee           : royaltyAmount,
      feeRecipientAddress: receiver,
      makerAssetAmount,
      takerAssetAmount,
      makerAssetData,
      takerAssetData,
    });

    // const signedOrder = await signatureUtils.ecSignOrderAsync(
    //   this.provider,
    //   order,
    //   this.address,
    // );

    order.chainId = String(order.chainId);

    // Generate the order hash and sign it
    const signedOrder = await signTyped(
      this.provider,
      order,
      this.address,
    );

    const { orderHash } = await this.contracts.getOrderInfo(signedOrder);

    this.setStatus(APPROVED);

    return { ...signedOrder, orderHash };
  }

  /**
   * CANCEL
   * @param {array} items
   */
  async cancel(item) {
    const signedOrder = destructOrder(item);

    await this.contracts.cancelOrder(signedOrder);
  }

  /**
   * TRADE
   * @param {array} offeredItems
   * @param {array} receivedItems
   */
  async trade(offeredItems, receivedItems) {
    this.setStatus(CREATING);
    // encode the assets independantly

    const makerMultiAssetData = await Promise.all(
      offeredItems.map(
        (item) => this.contracts.encodeERC721AssetData(item.contractAddress, item.tokenID),
      ),
    );
    const makerMultiAssetAmounts = offeredItems.map((item) => 1);

    // encode all items for the order

    const makerAssetData = await this.contracts
      .encodeMultiAssetData(makerMultiAssetAmounts, makerMultiAssetData);

    // encode the assets independantly that we want to receive

    const takerMultiAssetData = await Promise.all(
      receivedItems.map(
        (item) => this.contracts.encodeERC721AssetData(item.contractAddress, item.tokenID),
      ),
    );
    const takerMultiAssetAmounts = receivedItems.map((item) => 1);

    // then encode all items for the order

    const takerAssetData = await this.contracts
      .encodeMultiAssetData(takerMultiAssetAmounts, takerMultiAssetData);

    this.setStatus(APPROVING);
    // need to check if all the offers items have approved our proxy
    await Promise.all(
      offeredItems.map(
        (offeredItem) => this.contracts.erc721ApproveForAll(offeredItem.contractAddress),
      ),
    );

    const makerAssetAmount = new BigNumber(1);
    const takerAssetAmount = new BigNumber(1);

    // Create the order
    const order = createOrder({
      chainId     : this.chainId,
      makerAddress: this.address,
      makerAssetAmount,
      takerAssetAmount,
      makerAssetData,
      takerAssetData,
    });

    this.setStatus(SIGN);

    // signedOrder = await signatureUtils.ecSignOrderAsync(
    //   this.provider,
    //   order,
    //   this.address,
    // );

    order.chainId = String(order.chainId);

    const signedOrder = await signTyped(
      this.provider,
      order,
      this.address,
    );

    const { orderHash } = await this.contracts.getOrderInfo(signedOrder);

    this.setStatus(APPROVED);

    return { ...signedOrder, orderHash };
  }

  /**
   * APPROVE TRADE
   * @param {object} order
   */
  async approveTrade(order) {
    this.setStatus(CREATING);
    const signedOrder = destructOrder(order);

    const { nestedAssetData } = await this.contracts.decodeMultiAssetData(order.takerAssetData);

    const takerAssets = await Promise.all(
      nestedAssetData.map((offeredItem) => this.contracts.decodeERC721AssetData(offeredItem)),
    );

    this.setStatus(APPROVING);

    await Promise.all(
      takerAssets.map(
        (offeredItem) => this.contracts.erc721ApproveForAll(offeredItem.tokenAddress),
      ),
    );

    this.setStatus(APPROVING_FILL);

    const paymentFee = 0;
    const txHash = await this.contracts.fillOrder(signedOrder, paymentFee);

    this.setStatus(APPROVED);

    return { ...order, txHash };
  }

  /**
   * APPROVE TRADE
   * @param {object} order
   */
  async approveOffer(order) {
    const nativeERC20Balance = await this.contracts.balanceOfNativeERC20(order.makerAddress);
    if (BigNumber(order.makerAssetAmount).isGreaterThan(nativeERC20Balance)) {
      return {
        error: true,
      };
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
          if (type === 'EIP721') {
            await this.contracts.erc721ApproveForAll(address);
          } else if (type === 'EIP1155') {
            await this.contracts.erc1155ApproveForAll(address);
          }
        },
      ),
    );

    this.setStatus(APPROVING_FILL);

    const txHash = await this.contracts.fillOrder(signedOrder);

    this.setStatus(APPROVED);

    return { ...order, txHash };
  }

  /**
   * CREATE NFT
   * @param {object} order
   */
  async createNFT(metadata, address) {
    this.setStatus(CREATING);
    const tx = await this.contracts.createToken(metadata, address);

    const { tokenId } = tx.events.Transfer.returnValues;

    this.setStatus(APPROVED);

    return tokenId;
  }

  async deployContract(name, symbol) {
    const tx = await this.contracts.deploy721Contract(name, symbol);
    this.setStatus(APPROVED);
    return tx;
  }

  getCollections() {
    return this.contracts.getCollections();
  }

  async transfer(item, reciver) {
    const { contractAddress, tokenID, contract } = item;
    const { type } = contract;
    this.setStatus(APPROVING);
    if (type === 'EIP721') {
      await this.contracts.transferERC721NFT(contractAddress, reciver, tokenID);
    } else if (type === 'EIP1155') {
      await this.contracts.transferERC1155NFT(contractAddress, reciver, tokenID);
    }

    this.setStatus(APPROVED);
  }
}
