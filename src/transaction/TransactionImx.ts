import { Link ,ImmutableXClient} from '@imtbl/imx-sdk';
import { Wallet } from '../wallet/Wallet';
import {
  APPROVING,
  APPROVED,
  SIGN,
  NULL_ADDRESS,
  CANCELLING,
} from '../constants';
import Emitter from '../utils/emitter';
import { findChainNameById } from '../utils/chain';
import { ImmutableXApiAddress, ImmutableXLinkAddress } from '../utils/immutableX';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { ExternalOrder } from '../types';

export default class TransactionImmutableX {
  listener: Function;
  wallet: Wallet;
  address: string;
  chainId: string;
  link: any;

  constructor(data) {
    this.wallet = data.wallet;
    this.address = data.address;
    this.chainId = data.chainId;
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


  async buy(order: ExternalOrder){
    this.setStatus(APPROVING);

   const res = await this.link.buy({ orderIds: [Number(order.orderHash)] });
    this.setStatus(APPROVED);

    return res;
  }

  async list({ contractAddress, tokenID,  price,  itemChainId}) {

    if (String(itemChainId) !== String(this.chainId)) {
      throw new Error(`Please connect to ${findChainNameById(itemChainId)}`);
    }

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

  async cancelOrder(order: ExternalOrder) {
    this.setStatus(CANCELLING);
    const res = await this.link.cancel({ orderId: order.orderHash });
    return res;
  }

  async getBalance(address:string) {
    const client = await ImmutableXClient.build({
      publicApiUrl: ImmutableXApiAddress,
    })
      const balances = await client.getBalances({ user: address } as any)
      const balanceFormatted = ethers.utils.formatEther(balances.imx);
      const balance = Web3.utils.toWei(balanceFormatted);
      return balance;
  }
}