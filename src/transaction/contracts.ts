import BigNumber from 'bignumber.js';
import addresses, { addressesParameter } from '../addresses';
import transactionConfirmation from '../utils/transactionConfirmation';
import { NULL_ADDRESS, ZERO } from '../constants';
import ERC721ABI from './abis/ERC721ABI';
import ERC1155ABI from './abis/ERC1155ABI';
import ERC20ABI from './abis/ERC20ABI';
import ExchangeABI from './abis/ExchangeABI';
import ForwarderABI from './abis/ForwarderABI';
import CollectionsABI from './abis/CollectionsABI';
import RoyaltiesManagerABI from './abis/RoyaltiesManagerABI';
import send from '../utils/send';
import { Wallet } from '../wallet/Wallet';
import { Item } from '../types/ItemInterface';
import LibAssetDataABI from './abis/LibAssetDataABI';

export default class Contracts {
  address: string;
  wallet: Wallet;
  addresses: addressesParameter;
  marketId: string;

  constructor(wallet, address, chainId, marketId) {
    this.wallet = wallet;
    this.address = address;
    this.addresses = addresses[chainId];
    this.marketId = marketId;
  }

  /**
   *
   * @param String contractAddress
   */
  getOwner(contractAddress, tokenID) {
    const erc721Token = new this.wallet.provider.eth.Contract(ERC721ABI, contractAddress);
    return erc721Token.methods.ownerOf(tokenID).call();
  }

  /**
   *
   * @param String contractAddress
   */
  async erc721ApproveForAll(contractAddress) {
    const isApprovedForAll = await this.isErc721ApprovedForAll(contractAddress)

    if (!isApprovedForAll) {
      const erc721Token = new this.wallet.provider.eth.Contract(ERC721ABI, contractAddress);
      const ERC721Approval = await erc721Token.methods
        .setApprovalForAll(this.addresses.ERC721Proxy, true);
      const { transactionHash } = (await send(ERC721Approval, { from: this.address })) as any;

      await transactionConfirmation(this.wallet.provider, transactionHash);
    }
  }


  /**
 * @param String contractAddress
 */
  async isErc721ApprovedForAll(contractAddress: string) {
    const erc721Token = new this.wallet.provider.eth.Contract(
      ERC721ABI,
      contractAddress
    );
    return erc721Token.methods
      .isApprovedForAll(this.address, this.addresses.ERC721Proxy)
      .call({ from: this.address });
  }


  /**
 *
 * @param String contractAddress
 */
  async erc1155ApproveForAll(contractAddress) {
    const isApprovedForAll = await this.isErc1155ApprovedForAll(contractAddress)

    if (!isApprovedForAll) {
      const erc1155Token = new this.wallet.provider.eth.Contract(ERC1155ABI, contractAddress);
      const ERC1155Approval = await erc1155Token.methods
        .setApprovalForAll(this.addresses.ERC1155Proxy, true);

      const { transactionHash } = (await send(ERC1155Approval, { from: this.address })) as any;

      await transactionConfirmation(this.wallet.provider, transactionHash);
    }
  }

  /**
   * @param String contractAddress
   */
  async isErc1155ApprovedForAll(contractAddress: string) {
    const erc1155Token = new this.wallet.provider.eth.Contract(ERC1155ABI, contractAddress);
    return await erc1155Token.methods
      .isApprovedForAll(this.address, this.addresses.ERC1155Proxy)
      .call({ from: this.address });
  }

  async isApprovedForAll(item: Item): Promise<boolean> {
    const { contractAddress, contractType } = item;
    if (contractType === "EIP721") {
      return await this.isErc721ApprovedForAll(contractAddress);
    } else if (contractType === "EIP1155") {
      return await this.isErc1155ApprovedForAll(contractAddress);
    } else {
      throw Error(
        `Unsupported contractType \"${contractType}\" for \"approve\"`
      );
    }
  }

  /**
   * APPROVE FOR ALL
   */
  async approveForAll(
    contractAddress: string,
    contractType: string
  ) {
    if (contractType === "EIP721") {
      await this.erc721ApproveForAll(contractAddress);
    } else if (contractType === "EIP1155") {
      await this.erc1155ApproveForAll(contractAddress);
    } else {
      throw Error(
        `Unsupported contractType \"${contractType}\" for \"approve\"`
      );
    }
  }


  balanceOfNativeERC20(address = this.address) {
    const NativeERC20Contract = new this.wallet.provider.eth.Contract(ERC20ABI, this.addresses.NativeERC20);
    return NativeERC20Contract.methods.balanceOf(address).call({ from: this.address });
  }

  balanceOfERC20(address = this.address, ERC20Address: string) {
    const NativeERC20Contract = new this.wallet.provider.eth.Contract(ERC20ABI, ERC20Address);
    return NativeERC20Contract.methods.balanceOf(address).call({ from: this.address });
  }

  balanceOfERC1155(contractAddress, tokenID) {
    const ERC1155Contract = new this.wallet.provider.eth.Contract(ERC1155ABI, contractAddress);
    return ERC1155Contract.methods.balanceOf(this.address, tokenID).call({ from: this.address });
  }

  deposit() {
    const NativeERC20Contract = new this.wallet.provider.eth.Contract(ERC20ABI, this.addresses.NativeERC20);
    return NativeERC20Contract.methods.deposit();
  }

  convertToNativeERC20(value) {
    const method = this.deposit();
    return send(method, {
      from: this.address,
      value,
    });
  }

  ERC20Allowance(ERC20Address: string) {
    const NativeERC20Contract = new this.wallet.provider.eth.Contract(ERC20ABI, ERC20Address);

    return NativeERC20Contract.methods.allowance(
      this.address,
      this.addresses.ERC20Proxy,
    ).call({ from: this.address });
  }

  NativeERC20Allowance() {
    const NativeERC20Contract = new this.wallet.provider.eth.Contract(ERC20ABI, this.addresses.NativeERC20);
    return NativeERC20Contract.methods.allowance(
      this.address,
      this.addresses.ERC20Proxy,
    ).call({ from: this.address });
  }

  NativeERC20Approve() {
    const NativeERC20Contract = new this.wallet.provider.eth.Contract(ERC20ABI, this.addresses.NativeERC20);
    const method = NativeERC20Contract.methods
      .approve(this.addresses.ERC20Proxy, new BigNumber(2).pow(256).minus(1).toString());
    return send(method, { from: this.address });
  }
  ERC20Approve(erc20Address: string) {
    // fix the amount transfered to the proxy
    const NativeERC20Contract = new this.wallet.provider.eth.Contract(ERC20ABI, erc20Address);
    const method = NativeERC20Contract.methods
      .approve(this.addresses.ERC20Proxy, new BigNumber(2).pow(256).minus(1));
    return send(method, { from: this.address });
  }

  encodeERC721AssetData(contractAddress, tokenID) {
    const LibAssetDataContract = new this.wallet.provider.eth.Contract(LibAssetDataABI, this.addresses.LibAssetData);
    return LibAssetDataContract.methods.encodeERC721AssetData(
      contractAddress,
      tokenID,
    ).call({ from: this.address });
  }

  encodeERC1155AssetData(contractAddress, tokenID, amount) {
    const LibAssetDataContract = new this.wallet.provider.eth.Contract(LibAssetDataABI, this.addresses.LibAssetData);
    return LibAssetDataContract.methods.encodeERC1155AssetData(
      contractAddress,
      [tokenID],
      [amount],
      '0x0',
    ).call({ from: this.address });
  }

  encodeERC20AssetData(paymentTokenAddress = this.addresses.NativeERC20) {
    const LibAssetDataContract = new this.wallet.provider.eth.Contract(LibAssetDataABI, this.addresses.LibAssetData);
    return LibAssetDataContract.methods.encodeERC20AssetData(paymentTokenAddress)
      .call({ from: this.address });
  }

  decodeERC20AssetData(decodeERC20AssetData) {
    const LibAssetDataContract = new this.wallet.provider.eth.Contract(LibAssetDataABI, this.addresses.LibAssetData);
    return LibAssetDataContract.methods.decodeERC20AssetData(
      decodeERC20AssetData,
    ).call({ from: this.address });
  }
  encodeMultiAssetData(makerAssetAmountArray, erc721AssetDataArray) {
    const LibAssetDataContract = new this.wallet.provider.eth.Contract(LibAssetDataABI, this.addresses.LibAssetData);
    return LibAssetDataContract.methods.encodeMultiAssetData(
      makerAssetAmountArray,
      erc721AssetDataArray,
    ).call({ from: this.address });
  }

  decodeMultiAssetData(MultiAssetData) {
    const LibAssetDataContract = new this.wallet.provider.eth.Contract(LibAssetDataABI, this.addresses.LibAssetData);
    return LibAssetDataContract.methods.decodeMultiAssetData(
      MultiAssetData,
    ).call({ from: this.address });
  }

  decodeERC721AssetData(ERC721AssetData) {
    const LibAssetDataContract = new this.wallet.provider.eth.Contract(LibAssetDataABI, this.addresses.LibAssetData);
    return LibAssetDataContract.methods.decodeERC721AssetData(
      ERC721AssetData,
    ).call({ from: this.address });
  }

  getOrderInfo(signedOrder) {
    const exchangeContract = new this.wallet.provider.eth.Contract(ExchangeABI, this.addresses.Exchange);
    return exchangeContract.methods.getOrderInfo(signedOrder).call();
  }

  async fillOrder(signedOrder, value = '') {
    const exchangeContract = new this.wallet.provider.eth.Contract(ExchangeABI, this.addresses.Exchange);
    const buyOrder = await exchangeContract.methods.fillOrder(
      signedOrder, signedOrder.signature, this.marketId
    );
    const { transactionHash } = (await send(buyOrder, {
      from: this.address,
      value,
    })) as any;
    return transactionHash;
  }

  cancelOrder(signedOrder) {
    const exchangeContract = new this.wallet.provider.eth.Contract(ExchangeABI, this.addresses.Exchange);
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
    const erc721Token = new this.wallet.provider.eth.Contract(ERC721ABI, contractAddress);
    const method = erc721Token.methods.mint(this.address, metadata);
    return send(method, {
      from: this.address,
    });
  }

  get721Nonce() {
    const erc721Token = new this.wallet.provider.eth.Contract(ERC721ABI, this.addresses.NFTrade721);
    return erc721Token.methods.getNonce(this.address).call();
  }

  create721ABI(metadata) {
    const erc721Token = new this.wallet.provider.eth.Contract(ERC721ABI, this.addresses.NFTrade721);
    return erc721Token.methods.awardItem(metadata).encodeABI();
  }

  async transferERC721NFT(contractAddress, reciver, tokenID) {
    const erc721Token = new this.wallet.provider.eth.Contract(ERC721ABI, contractAddress);
    const method = erc721Token.methods.safeTransferFrom(this.address, reciver, tokenID);
    return send(method, {
      from: this.address,
    });
  }

  async transferERC1155NFT(contractAddress, reciver, tokenID) {
    const erc721Token = new this.wallet.provider.eth.Contract(ERC1155ABI, contractAddress);
    const method = erc721Token.methods.safeTransferFrom(this.address, reciver, tokenID, 1, []);
    return send(method, {
      from: this.address,
    });
  }

  /* async deploy721Contract(name, symbol) {
    const contract = require('../abis/721Token.json');
    const MyContract = new this.wallet.provider.eth.Contract(contract.abi);
    const method = MyContract.deploy({
      data     : contract.bytecode,
      arguments: [name, symbol, this.addresses.Collections],
    });

    const gas = await this.wallet.provider.eth.estimateGas({
      data: method.encodeABI(),
    });

    const gasPrice = await this.wallet.provider.eth.getGasPrice();

    return send(method, {
      from: this.address,
    });
  } */

  async getCollections() {
    const collectionsContract = new this.wallet.provider.eth.Contract(
      CollectionsABI, this.addresses.Collections,
    );
    return collectionsContract.methods.getCollections().call({
      from: this.address,
    });
  }

  getRoyalties(collectionAddress, tokenId, salePrice) {
    const royaltiesContract = new this.wallet.provider.eth.Contract(
      RoyaltiesManagerABI, this.addresses.RoyaltiesManager,
    );
    return royaltiesContract.methods.getRoyalties(collectionAddress, tokenId, salePrice)
      .call({ from: this.address });
  }
}

