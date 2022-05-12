import BigNumber from 'bignumber.js';
import addresses from '../../addresses';
import transactionConfirmation from './transactionConfirmation';
import { NULL_ADDRESS, ZERO } from './constants';
import ERC721ABI from '../abis/ERC721ABI';
import ERC1155ABI from '../abis/ERC1155ABI';
import ERC20ABI from '../abis/ERC20ABI';
import DevUtilsABI from '../abis/DevUtilsABI';
import ExchangeABI from '../abis/ExchangeABI';
import ForwarderABI from '../abis/ForwarderABI';
import PlantATreeABI from '../abis/PlantATreeABI';
import CollectionsABI from '../abis/CollectionsABI';
import RoyaltiesManagerABI from '../abis/RoyaltiesManagerABI';
import RoyaltiesABI from '../abis/RoyaltiesABI';
import send from '../send';

export default class Contracts {
  constructor(web3, address, chainId) {
    this.web3 = web3;
    this.address = address;
    this.addresses = addresses[chainId];
  }

  /**
   *
   * @param String contractAddress
   */
  getOwner(contractAddress, tokenID) {
    const erc721Token = new this.web3.eth.Contract(ERC721ABI, contractAddress);
    return erc721Token.methods.ownerOf(tokenID).call();
  }

  /**
   *
   * @param String contractAddress
   */
  async erc721ApproveForAll(contractAddress) {
    const erc721Token = new this.web3.eth.Contract(ERC721ABI, contractAddress);
    const isApprovedForAll = await erc721Token.methods
      .isApprovedForAll(this.address, this.addresses.ERC721Proxy)
      .call({ from: this.address });

    if (!isApprovedForAll) {
      const ERC721Approval = await erc721Token.methods
        .setApprovalForAll(this.addresses.ERC721Proxy, true);
      const { transactionHash } = await send(ERC721Approval, { from: this.address });

      await transactionConfirmation(this.web3, transactionHash);
    }
  }

  /**
   *
   * @param String contractAddress
   */
  async erc1155ApproveForAll(contractAddress) {
    const erc1155Token = new this.web3.eth.Contract(ERC1155ABI, contractAddress);
    const isApprovedForAll = await erc1155Token.methods
      .isApprovedForAll(this.address, this.addresses.ERC1155Proxy)
      .call({ from: this.address });

    if (!isApprovedForAll) {
      const ERC1155Approval = await erc1155Token.methods
        .setApprovalForAll(this.addresses.ERC1155Proxy, true);

      const { transactionHash } = await send(ERC1155Approval, { from: this.address });

      await transactionConfirmation(this.web3, transactionHash);
    }
  }

  balanceOfNativeERC20(address = this.address) {
    const NativeERC20Contract = new this.web3.eth.Contract(ERC20ABI, this.addresses.NativeERC20);
    return NativeERC20Contract.methods.balanceOf(address).call({ from: this.address });
  }

  balanceOfERC1155(contractAddress, tokenID) {
    const ERC1155Contract = new this.web3.eth.Contract(ERC1155ABI, contractAddress);
    return ERC1155Contract.methods.balanceOf(this.address, tokenID).call({ from: this.address });
  }

  deposit() {
    const NativeERC20Contract = new this.web3.eth.Contract(ERC20ABI, this.addresses.NativeERC20);
    return NativeERC20Contract.methods.deposit();
  }

  convertToNativeERC20(value) {
    const method = this.deposit();
    return send(method, {
      from: this.address,
      value,
    });
  }

  NativeERC20Allowance() {
    const NativeERC20Contract = new this.web3.eth.Contract(ERC20ABI, this.addresses.NativeERC20);
    return NativeERC20Contract.methods.allowance(
      this.address,
      this.addresses.ERC20Proxy,
    ).call({ from: this.address });
  }

  NativeERC20Approve() {
    const NativeERC20Contract = new this.web3.eth.Contract(ERC20ABI, this.addresses.NativeERC20);
    const method = NativeERC20Contract.methods
      .approve(this.addresses.ERC20Proxy, new BigNumber(2).pow(256).minus(1).toString());
    return send(method, { from: this.address });
  }

  encodeERC721AssetData(contractAddress, tokenID) {
    const DevUtilsContract = new this.web3.eth.Contract(DevUtilsABI, this.addresses.DevUtils);
    return DevUtilsContract.methods.encodeERC721AssetData(
      contractAddress,
      tokenID,
    ).call({ from: this.address });
  }

  encodeERC1155AssetData(contractAddress, tokenID, amount) {
    const DevUtilsContract = new this.web3.eth.Contract(DevUtilsABI, this.addresses.DevUtils);
    return DevUtilsContract.methods.encodeERC1155AssetData(
      contractAddress,
      [tokenID],
      [amount],
      '0x0',
    ).call({ from: this.address });
  }

  encodeERC20AssetData() {
    const DevUtilsContract = new this.web3.eth.Contract(DevUtilsABI, this.addresses.DevUtils);
    return DevUtilsContract.methods.encodeERC20AssetData(this.addresses.NativeERC20)
      .call({ from: this.address });
  }

  encodeMultiAssetData(makerAssetAmountArray, erc721AssetDataArray) {
    const DevUtilsContract = new this.web3.eth.Contract(DevUtilsABI, this.addresses.DevUtils);
    return DevUtilsContract.methods.encodeMultiAssetData(
      makerAssetAmountArray,
      erc721AssetDataArray,
    ).call({ from: this.address });
  }

  decodeMultiAssetData(MultiAssetData) {
    const DevUtilsContract = new this.web3.eth.Contract(DevUtilsABI, this.addresses.DevUtils);
    return DevUtilsContract.methods.decodeMultiAssetData(
      MultiAssetData,
    ).call({ from: this.address });
  }

  decodeERC721AssetData(ERC721AssetData) {
    const DevUtilsContract = new this.web3.eth.Contract(DevUtilsABI, this.addresses.DevUtils);
    return DevUtilsContract.methods.decodeERC721AssetData(
      ERC721AssetData,
    ).call({ from: this.address });
  }

  getOrderInfo(signedOrder) {
    const exchangeContract = new this.web3.eth.Contract(ExchangeABI, this.addresses.Exchange);
    return exchangeContract.methods.getOrderInfo(signedOrder).call();
  }

  async fillOrder(signedOrder, value = 0) {
    const exchangeContract = new this.web3.eth.Contract(ExchangeABI, this.addresses.Exchange);
    const buyOrder = await exchangeContract.methods.fillOrder(
      signedOrder, signedOrder.takerAssetAmount, signedOrder.signature,
    );
    const { transactionHash } = await send(buyOrder, {
      from: this.address,
      value,
    });
    return transactionHash;
  }

  async marketBuyOrdersWithEth(signedOrder, isGreenPay, greenPayFee) {
    const affiliateFeeRecipient = NULL_ADDRESS;
    const affiliateFee = ZERO;

    const takerAssetAmount = new BigNumber(signedOrder.takerAssetAmount);
    const takerFee = new BigNumber(signedOrder.takerFee);
    let buyOrder = '';
    if (isGreenPay) {
      const platATreeContract = new this.web3.eth.Contract(PlantATreeABI, this.addresses.GreenPay);
      buyOrder = await platATreeContract.methods.marketBuyOrdersWithEth(
        [signedOrder],
        signedOrder.makerAssetAmount,
        [signedOrder.signature],
        [String(affiliateFee)],
        [affiliateFeeRecipient],
        greenPayFee || ZERO,
      );
    } else {
      const forwarderContract = new this.web3.eth.Contract(ForwarderABI, this.addresses.Forwarder);
      buyOrder = await forwarderContract.methods.marketBuyOrdersWithEth(
        [signedOrder],
        signedOrder.makerAssetAmount,
        [signedOrder.signature],
        [String(affiliateFee)],
        [affiliateFeeRecipient],
      );
    }
    const { transactionHash } = await send(buyOrder, {
      from : this.address,
      value: takerAssetAmount.plus(takerFee).plus(affiliateFee).plus(greenPayFee),
    });
    return transactionHash;
  }

  cancelOrder(signedOrder) {
    const exchangeContract = new this.web3.eth.Contract(ExchangeABI, this.addresses.Exchange);
    const method = exchangeContract.methods.cancelOrder(
      signedOrder,
    );
    return send(method, {
      from: this.address,
    });
  }

  /**
   *
   * @param String metadata
   */
  createToken(metadata, contractAddress) {
    const erc721Token = new this.web3.eth.Contract(ERC721ABI, contractAddress);
    const method = erc721Token.methods.mint(this.address, metadata);
    return send(method, {
      from: this.address,
    });
  }

  get721Nonce() {
    const erc721Token = new this.web3.eth.Contract(ERC721ABI, this.addresses.NFTrade721);
    return erc721Token.methods.getNonce(this.address).call();
  }

  create721ABI(metadata) {
    const erc721Token = new this.web3.eth.Contract(ERC721ABI, this.addresses.NFTrade721);
    return erc721Token.methods.awardItem(metadata).encodeABI();
  }

  async transferERC721NFT(contractAddress, reciver, tokenID) {
    const erc721Token = new this.web3.eth.Contract(ERC721ABI, contractAddress);
    const method = erc721Token.methods.safeTransferFrom(this.address, reciver, tokenID);
    return send(method, {
      from: this.address,
    });
  }

  async transferERC1155NFT(contractAddress, reciver, tokenID) {
    const erc721Token = new this.web3.eth.Contract(ERC1155ABI, contractAddress);
    const method = erc721Token.methods.safeTransferFrom(this.address, reciver, tokenID, 1, []);
    return send(method, {
      from: this.address,
    });
  }

  async deploy721Contract(name, symbol) {
    const contract = require('../abis/721Token.json');
    const MyContract = new this.web3.eth.Contract(contract.abi);
    const method = MyContract.deploy({
      data     : contract.bytecode,
      arguments: [name, symbol, this.addresses.Collections],
    });

    const gas = await this.web3.eth.estimateGas({
      data: method.encodeABI(),
    });

    const gasPrice = await this.web3.eth.getGasPrice();

    return send(method, {
      from: this.address,
    });
  }

  async getCollections() {
    const collectionsContract = new this.web3.eth.Contract(
      CollectionsABI, this.addresses.Collections,
    );
    return collectionsContract.methods.getCollections().call({
      from: this.address,
    });
  }

  /* Royalties */

  getRoyalties(collectionAddress, tokenId, salePrice) {
    const royaltiesContract = new this.web3.eth.Contract(
      RoyaltiesManagerABI, this.addresses.RoyaltiesManager,
    );
    return royaltiesContract.methods.getRoyalties(collectionAddress, tokenId, salePrice)
      .call({ from: this.address });
  }

  async getRoyaltiesSplit(address) {
    const royaltyAddressContract = new this.web3.eth.Contract(
      RoyaltiesABI, address,
    );
    try {
      const res = await royaltyAddressContract.methods.getRoyalties()
        .call({ from: this.address });
      return res;
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  async getTokenRoyaltyBalance(tokenID, contractAddress) {
    const royaltyAddressContract = new this.web3.eth.Contract(
      RoyaltiesABI, contractAddress,
    );
    const res = await royaltyAddressContract.methods.getTokenBalance(tokenID)
      .call({ from: this.address });
    return res;
  }

  async claimCommunityBatch(tokenIDs, contractAddress) {
    const royaltyAddressContract = new this.web3.eth.Contract(
      RoyaltiesABI, contractAddress,
    );
    const method = royaltyAddressContract.methods.claimCommunityBatch(tokenIDs);
    return send(method, {
      from: this.address,
    });
  }
}
