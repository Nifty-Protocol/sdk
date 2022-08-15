import { ExternalOrder } from '../types';
import TransactionImx from '../transaction/TransactionImx';

class imxController {
  listener: Function;

  constructor(options) {
    this.listener = options.listener;
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

    const transaction = new TransactionImx();

    if (this.listener) {
      transaction.setStatusListener(this.listener);
    }

    return transaction;
  }


  async buy(order: ExternalOrder) {
    const transaction = await this.initTransaction()

    const buyRes = await transaction.buy(order) ;
    return buyRes;
  }

  async list( contractAddress, tokenID, price ) {
    const transaction = await this.initTransaction()

    const listRes = await transaction.list({ contractAddress, tokenID, price}) ;
    return listRes;
  }

  async transfer(tokenID, addressToSend, contractAddress) {
    const transaction = await this.initTransaction()

    const transferRes = await transaction.transfer({tokenID, addressToSend, contractAddress}) ;
    return transferRes;
  }

  async cancelOrder(order: ExternalOrder) {

    const transaction = await this.initTransaction()
    
    const {orderHash} = order ;
    const cancelRes = await transaction.cancelOrder(orderHash) ;

    return cancelRes;
  }

  async getBalance(address: string) {
    const transaction = await this.initTransaction()
    
    const balanceRes = await transaction.getBalance(address) ;
    return balanceRes;
  }
}

export default imxController;