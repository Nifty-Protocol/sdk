import { Item } from './../types/ItemInterface';
import xrplTransaction from '../transaction/blockchainTransaction/xrplTransaction';
import { XRPL } from '../utils/chains';
import { APPROVED } from '../constants';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(time), time))

class ImxController {
  listener: Function;
  api: any;
  sdk: any;
  chainId: string;
  env: any;
  getListing: any;

  constructor(options) {
    this.listener = options.listener;
    this.api = options.api;
    this.chainId = options.wallet.walletProvider.chainId;
    this.env = options.env;
    this.sdk = options.wallet.walletProvider;
    this.getListing = options.getListing;
  }

  setStatusListener(listener: Function) {
    this.listener = listener;
  }

  setStatus(status) {
    if (this.listener) {
      setTimeout(() => this.listener(status), 0);
    }
  }

  async initTransaction() {

    const transaction = new xrplTransaction(this.sdk);

    if (this.listener) {
      transaction.setStatusListener(this.listener);
    }

    return transaction;
  }

  async buy(orderId) {
    const orderRes = await this.getListing(orderId, true) as any;

    const transaction = await this.initTransaction()

    const { price, contractAddress, tokenID, makerAddress } = orderRes;

    const tx = await transaction.buy({ contractAddress, tokenID, price, makerAddress });
    const apiRes = await this.api.externalOrders.update({
      id: tx?.txid,
      chainId: this.chainId,
      orderId,
      source: XRPL,
      txDetails: tx,
      action: 'buy'
    });

    this.setStatus(APPROVED);

    return apiRes.data;
  }

  async list(item, price, expirationTime: number) {
    const transaction = await this.initTransaction()

    const { contractAddress, tokenID, id } = item;
    const tx = await transaction.list({ contractAddress, tokenID, price, expirationTime });
    const apiRes = await this.api.externalOrders.update({
      id: tx?.txid,
      chainId: this.chainId,
      source: XRPL,
      txDetails: tx,
      tokenId: id
    });

    return apiRes.data;
  }

  async cancelOrder(orderId) {

    const transaction = await this.initTransaction()

    const orderRes = await this.getListing(orderId, true) as any;
    const { orderHash } = orderRes;

    const tx = await transaction.cancelOrder(orderHash);
    if (!tx.txid) {
      throw new Error('no cancel');
    }
    const apiRes = await this.api.externalOrders.update({
      id: orderHash,
      chainId: this.chainId,
      source: XRPL,
      txDetails: tx,
      action: 'cancel'
    });

    return apiRes.data;
  }

  /* async offer(item: Item, price: number, expirationTime: number, isFullConversion: boolean) {
    const transaction = await this.initTransaction()

    const { contractAddress, tokenID } = item;
    return  transaction.offer({ contractAddress, tokenID, price, expirationTime });
  }

  async acceptOffer(orderId: string) {
    const transaction = await this.initTransaction()

    return  transaction.acceptOffer(orderId);
  }

  async transfer(item, addressToSend) {
    const transaction = await this.initTransaction()

    const { tokenID, contractAddress } = item;
    const transferRes = await transaction.transfer({ tokenID, addressToSend, contractAddress });

    return transferRes;
  }

  async getAccountBalance(ERC20Address: string, address: string) {
    const transaction = await this.initTransaction()

    const balanceRes = await transaction.getBalance(address);
    return balanceRes;
  }

  async fillOrder(order) {
    const transaction = await this.initTransaction()
    const { orderHash } = order as any;
    const buyRes = await transaction.buy(orderHash);

    return buyRes;
  }

  async fillOrders(orders: string[]) {
    const transaction = await this.initTransaction()
    const buyRes = await transaction.buyMultiple(orders);

    return buyRes;
  } */

  getCollectionTaxon(collection: string): number {
    return Number(collection.split('-').pop() || 0);
  }

  async getCollections() {
    const collections = await this.api.contracts.getAll({
      search: this.sdk.user.account,
      chainId: this.chainId
    });
    return collections.data.map((x) => ({...x, contractAddress: x.address}));
  }

  async createNFTContract(name: string, symbol: string) {
    const collections = await this.getCollections();
    const nftaxons: number[] = collections.map(x => this.getCollectionTaxon(x.address)).sort();
    return this.api.contracts.create(
      {
        account: this.sdk.user.account,
        name,
        symbol,
        nftaxon: (nftaxons.pop() || 0) + 1,
        chainId: this.chainId,
        type: XRPL,
      },
      this.sdk.jwtUserdata.Meta.jwt
    );
  }


  async createNFT(metadata: string, selectedCollectionAddress: string) {
    const transaction = await this.initTransaction();

    const nftaxon: number = this.getCollectionTaxon(selectedCollectionAddress);

    if (!nftaxon) {
      return;
    }

    const res = await transaction.createNFT(metadata, nftaxon)
    return res
  }
}

export default ImxController;