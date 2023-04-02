import { XummSdk } from 'xumm-sdk';
import { Client, xrpToDrops, unixTimeToRippleTime } from 'xrpl';
import {
  APPROVING,
  APPROVED,
  SIGN,
  CANCELLING,
  PROD,
  TESTNET,
} from '../../constants';
import Emitter from '../../utils/emitter';

const brokerAddress = 'rEaCC2tUMnPpGcSG6n1Pj75hqNfJeG9TdH';

export default class TransactionXrpl {
  listener: Function;
  sdk;

  constructor(_sdk) {
    this.sdk = _sdk;
  }


  setStatusListener(listener: Function) {
    this.listener = listener;
  }

  setStatus(status) {
    if (this.listener) {
      setTimeout(() => this.listener(status), 0);
    }
  }


  /* async buy(orderHash) {
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
  } */

  async list({ contractAddress, tokenID, price, expirationTime }) {
    this.setStatus(SIGN);
    Emitter.emit('signature', () => { })

    let d = new Date();
    d.setTime(d.getTime() + expirationTime);

    const payload = {
      txjson: {
        TransactionType: 'NFTokenCreateOffer',
        Destination: brokerAddress, // broker
        Expiration: unixTimeToRippleTime(d.getTime()),
        NFTokenID: tokenID,
        Amount: xrpToDrops(price),
        Flags: 1,
      }
    };

    const {resolved} = await this.sdk.payload.createAndSubscribe(payload as any, (payloadEvent) => {
      if (typeof payloadEvent.data.signed !== 'undefined') {
        return payloadEvent.data;
      }
    });

    const resolveData: any = await resolved;

    if (!resolveData.signed) {
      throw new Error('The sign request was rejected :(')
    }

    return resolveData;
  }

  async buy({contractAddress, tokenID, price, makerAddress}) {
    this.setStatus(APPROVING);

    const payload = {
      txjson: {
        TransactionType: 'NFTokenCreateOffer',
        Owner: makerAddress,
        NFTokenID: tokenID,
        Amount: xrpToDrops((price * 1.02).toFixed(5)),
      }
    };

    const {resolved} = await this.sdk.payload.createAndSubscribe(payload as any, (payloadEvent) => {
      if (typeof payloadEvent.data.signed !== 'undefined') {
        return payloadEvent.data;
      }
    });

    const resolveData: any = await resolved;

    if (!resolveData.signed) {
      throw new Error('The sign request was rejected :(')
    }

    this.setStatus(APPROVED);

    return resolveData;
  }

  async cancelOrder(orderHash) {
    this.setStatus(CANCELLING);

    const payload = {
      txjson: {
        TransactionType: 'NFTokenCancelOffer',
        NFTokenOffers: [orderHash],
      }
    };

    const {resolved} = await this.sdk.payload.createAndSubscribe(payload as any, (payloadEvent) => {
      if (typeof payloadEvent.data.signed !== 'undefined') {
        return payloadEvent.data;
      }
    });

    const resolveData: any = await resolved;
    
    if (!resolveData.signed) {
      throw new Error('The sign request was rejected :(')
    }

    return resolveData;
  }

  /* async transfer({ tokenID, addressToSend, contractAddress }) {
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
  } */
}