import { Link ,ImmutableXClient} from '@imtbl/imx-sdk';
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
import { ImmutableXApiAddress, ImmutableXLinkAddress } from '../utils/immutableX';
import Web3 from 'web3';
import { ethers } from 'ethers';

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



  async buy(order: Order){
    this.setStatus(APPROVING);

    if (String(order.chainId) !== String(this.chainId)) {
      throw new Error(`Please connect to ${findChainNameById(order.chainId)}`);
    }

   const res = await this.link.buy({ orderIds: [Number(order.orderHash)] });
    this.setStatus(APPROVED);

    return res;
  }

  async list({ contractAddress, tokenID, contractType, price, exchangeAddress, itemChainId, expirationTime, ERC20Address = NULL_ADDRESS }) {

    if (String(itemChainId) !== String(this.chainId)) {
      throw new Error(`Please connect to ${findChainNameById(itemChainId)}`);
    }

    this.setStatus(SIGN);
    Emitter.emit('signature', () => { })

    this.link = new Link(ImmutableXLinkAddress);
    const sellParams = {
      amount: price,
      tokenId: tokenID,
      tokenAddress: contractAddress,
    };
    return this.link.sell(sellParams);
  }



  async cancelOrder(order: Order) {
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
