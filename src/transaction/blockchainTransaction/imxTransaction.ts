import { Link, ImmutableXClient, ERC721TokenType } from '@imtbl/imx-sdk';
import {
  APPROVING,
  APPROVED,
  SIGN,
  CANCELLING,
  PROD,
  TESTNET,
} from '../../constants';
import Emitter from '../../utils/emitter';
import Web3 from 'web3';
import { ethers } from 'ethers';

const endpoints = {
  [PROD]: {
    link: 'https://link.x.immutable.com',
    api: 'https://api.x.immutable.com/v1',
  },
  [TESTNET]: {
    link: 'https://link.sandbox.x.immutable.com',
    api: 'https://api.sandbox.x.immutable.com/v1',
  }
};


const feeRecipientAddress = '0x1249cae9fabbdc18f5368355ac1febd06b426374';

export default class TransactionImx {
  listener: Function;
  link: Link;
  endpoints: any;

  constructor(env) {
    this.endpoints = endpoints[env];
    this.link = new Link(this.endpoints.link);
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
    return this.buyMultiple([orderHash]);
  }

  async buyMultiple(orderIds: string[]) {
    this.setStatus(APPROVING);

    const res = await this.link.buy({ orderIds, fees: [{
      recipient: feeRecipientAddress,
      percentage: 1,
    }]});
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
      fees: [{
        recipient: feeRecipientAddress,
        percentage: 1,
      }]
    };
    return this.link.sell(sellParams);
  }

  async transfer({ tokenID, addressToSend, contractAddress }) {
    this.setStatus(APPROVING);

    const res = await this.link.batchNftTransfer([
      {
        type: ERC721TokenType.ERC721,
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

  async offer({ contractAddress, tokenID, price, expirationTime }) {
    this.setStatus(SIGN);
    Emitter.emit('signature', () => { })

    const expirationTimestamp = Math.round(Date.now() / 1000) + expirationTime;

    const offerParams = {
      amount: price,
      tokenId: tokenID,
      tokenAddress: contractAddress,
      expirationTimestamp,
      fees: [{
        recipient: feeRecipientAddress,
        percentage: 1,
      }]
    };
    return this.link.makeOffer(offerParams);
  }

  async acceptOffer(orderId: string) {
    this.setStatus(APPROVING);

    const res = await this.link.acceptOffer({orderId});
    this.setStatus(APPROVED);

    return res;
  }

  async getBalance(address: string) {
    const client = await ImmutableXClient.build({
      publicApiUrl: this.endpoints.api,
    })
    const balances = await client.getBalances({ user: address } as any)
    const balanceFormatted = ethers.utils.formatEther(balances.imx);
    const balance = Web3.utils.toWei(balanceFormatted);
    return balance;
  }
}