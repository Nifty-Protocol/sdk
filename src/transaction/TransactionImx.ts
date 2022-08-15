import { Link, ImmutableXClient } from '@imtbl/imx-sdk';
import {
  APPROVING,
  APPROVED,
  SIGN,
  CANCELLING,
} from '../constants';
import Emitter from '../utils/emitter';
import { ImmutableXApiAddress, ImmutableXLinkAddress } from '../utils/immutableX';
import Web3 from 'web3';
import { ethers } from 'ethers';

export default class TransactionImx {
  listener: Function;
  link: any;

  constructor() {
    this.link = new Link(ImmutableXLinkAddress);
  }


  setStatusListener(listener: Function) {
    this.listener = listener;
  }

  setStatus(status) {
    if (this.listener) {
      setTimeout(() => this.listener(status), 0);
    }
  }


  async buy(orderHash) {
    this.setStatus(APPROVING);

    const res = await this.link.buy({ orderIds: [Number(orderHash)] });
    this.setStatus(APPROVED);

    return res;
  }

  async list({ contractAddress, tokenID, price }) {
    this.setStatus(SIGN);
    Emitter.emit('signature', () => { })

    const sellParams = {
      amount: price,
      tokenId: tokenID,
      tokenAddress: contractAddress,
    };
    return this.link.sell(sellParams);
  }

  async transfer({ tokenID, addressToSend, contractAddress }) {
    this.setStatus(APPROVING);

    const res = await this.link.batchNftTransfer([
      {
        type: 'ERC721',
        tokenId: tokenID,
        tokenAddress: contractAddress,
        toAddress: addressToSend,
      }
    ])
    this.setStatus(APPROVED);
    return res
  }

  async cancelOrder(orderHash) {
    this.setStatus(CANCELLING);

    const res = await this.link.cancel({ orderId: orderHash });
    return res;
  }

  async getBalance(address: string) {
    const client = await ImmutableXClient.build({
      publicApiUrl: ImmutableXApiAddress,
    })
    const balances = await client.getBalances({ user: address } as any)
    const balanceFormatted = ethers.utils.formatEther(balances.imx);
    const balance = Web3.utils.toWei(balanceFormatted);
    return balance;
  }
}