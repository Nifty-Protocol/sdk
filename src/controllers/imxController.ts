import imxTransaction from '../transaction/blockchainTransaction/imxTransaction';
import { IMMUTABLEX } from '../utils/chains';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(time), time))

class imxController {
  listener: Function;
  api: any;
  getListing: any;
  chainId: string;
  env: string;

  constructor(options) {
    this.listener = options.listener;
    this.api = options.api;
    this.getListing = options.getListing;
    this.chainId = options.wallet.walletProvider.chainId;
    this.env = options.env;
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

    const transaction = new imxTransaction(this.env);

    if (this.listener) {
      transaction.setStatusListener(this.listener);
    }

    return transaction;
  }


  async buy(orderId) {
    const orderRes = await this.getListing(orderId, true) as any;
    return this.fillOrder(orderRes)
  }

  async buyMultiple(orders) {
    return this.fillOrders(orders.map(x => Number(x.order_id)));
  }

  async list(item, price) {
    const transaction = await this.initTransaction()

    const { contractAddress, tokenID } = item;
    const listRes = await transaction.list({ contractAddress, tokenID, price });
    await sleep(2000);
    const apiResres = await this.api.externalOrders.update({id: listRes, chainId: this.chainId, source: IMMUTABLEX});

    return listRes;
  }

  async transfer(item, addressToSend) {
    const transaction = await this.initTransaction()

    const { tokenID, contractAddress } = item;
    const transferRes = await transaction.transfer({ tokenID, addressToSend, contractAddress });

    return transferRes;
  }

  async cancelOrder(orderId) {

    const transaction = await this.initTransaction()

    const orderRes = await this.getListing(orderId, true) as any;
    const { orderHash } = orderRes;

    const cancelRes = await transaction.cancelOrder(orderHash);
    await sleep(2000);
    const apiResres = await this.api.externalOrders.update({id: orderHash, chainId: this.chainId, source: IMMUTABLEX});

    return cancelRes;
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

  async fillOrders(orders: Number[]) {
    const transaction = await this.initTransaction()
    const buyRes = await transaction.buyMultiple(orders);

    return buyRes;
  }
}

export default imxController;