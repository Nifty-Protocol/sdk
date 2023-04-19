import { XummSdk } from 'xumm-sdk';
import { Client, xrpToDrops, unixTimeToRippleTime, convertStringToHex } from 'xrpl';
import {
  APPROVING,
  APPROVED,
  SIGN,
  CANCELLING,
  PROD,
  TESTNET,
  CREATING,
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

  async getTransaction(transaction: string) {
    const options = {
      command     : 'tx',
      transaction,
      binary      : false,
    };
    const client = new Client(this.sdk.user.networkEndpoint);
    await client.connect();

    try {
      const info: any = await client.request(options);
      return info?.result;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

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

  getNFTokenID (meta) {
    const data = meta.AffectedNodes.find(
      (x: any) => x.ModifiedNode?.LedgerEntryType === 'NFTokenPage'
      || x.CreatedNode?.LedgerEntryType === 'NFTokenPage',
    );
    const { PreviousFields, FinalFields, NewFields } = data.CreatedNode || data.ModifiedNode;
    const nfts = NewFields?.NFTokens
    || FinalFields.NFTokens.filter(
      (x) => !PreviousFields.NFTokens.some((y) => y.NFToken.NFTokenID === x.NFToken.NFTokenID),
    );
    return nfts.shift().NFToken;
  };

  async createNFT(metadata: string, nftaxon: number) {
    this.setStatus(CREATING);

    const payload = {
      txjson: {
        TransactionType: 'NFTokenMint',
        Account        : this.sdk.user.account,
        URI            : convertStringToHex(metadata),
        Flags          : 8,
        TransferFee    : 2000,
        NFTokenTaxon   : nftaxon,
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

    const info = await this.getTransaction(resolveData.txid);

    return this.getNFTokenID(info.meta);

    /* const tx = await this.contracts.createToken(metadata, selectedCollectionAddress) as any;
    const { tokenId } = tx.events.Transfer.returnValues; */


    // return tokenId;
  }

  /* async mint() {
    const address = await this.getUserAddress();
    const payload = {
      txjson: {
        TransactionType: 'NFTokenMint',
        Account        : address,
        URI            : convertStringToHex('https://ipfs.io/ipfs/QmckHPGbrXAPjTPprDuycqpGiPx6tMTmmnhCDTrgMu7559'),
        Flags          : 8,
        TransferFee    : 2000,
        NFTokenTaxon   : 1,
      },
    };

    this.walletProvider
      .payload
      .createAndSubscribe(payload, (payloadEvent) => {
        if (typeof payloadEvent.data.signed !== 'undefined') {
        // What we return here will be the resolved value of the `resolved` property
          return payloadEvent.data;
        }
      })
      .then(({ created, resolved }) => {
        alert(created.pushed
          ? 'Now check Xumm, there should be a push notification + sign request in your event list waiting for you ;)'
          : 'Now check Xumm, there should be a sign request in your event list waiting for you ;) (This would have been pushed, but it seems you did not grant Xumm the push permission)');

        resolved.then((payloadOutcome) => {
          alert(`Payload ${payloadOutcome.signed ? `signed (TX Hash: ${payloadOutcome.txid})` : 'rejected'}, see the browser console for more info`);
          console.log(payloadOutcome);
        });
      })
      .catch((e) => {
        alert('Paylaod error', e.message);
      });
  } */
}
