import { toBuffer } from 'ethereumjs-util';
import { signatureTypes } from './types';
import addresses from '../addresses';
import { DOMAIN, VERSION } from './constants';
import { send, signTypedDataUtils } from './utils';

/**
 *   @signTypedData - function that handles signing and metamask interaction
 */
const signTypedData = async (provider, address, payload) => {
  const methodsToTry = ['eth_signTypedData_v4', 'eth_signTypedData_v3', 'eth_signTypedData'];

  let lastErr;
  // eslint-disable-next-line no-restricted-syntax
  for await (const method of methodsToTry) {
    const typedData = {
      id    : methodsToTry.indexOf(method),
      params: [
        address,
        method === 'eth_signTypedData' ? payload : JSON.stringify(payload),
      ],
      jsonrpc: '2.0',
      method,
    };

    try {
      const response = await send(provider, typedData);
      return response;
    } catch (err) {
      lastErr = err;
      // If there are no more methods to try or the error says something other
      // than the method not existing, throw.
      if (!/(not handled|does not exist|not supported)/.test(err.message)) {
        throw err;
      }
    }
  }

  throw lastErr;
};

const signEth = async (provider, address, payload) => {
  const orderHash = signTypedDataUtils.generateTypedDataHash(payload);
  return send(provider, {
    method: 'eth_sign',
    params: [address, orderHash],
  });
};

/**
 *   @signTyped - main function to be called when signing
 */
export default async (provider, order, from, verifyingContract) => {
  if (!verifyingContract) {
    verifyingContract = addresses[Number(order.chainId)].Exchange;
  }
  const typedData = {
    ...signatureTypes,
    domain: {
      name             : DOMAIN,
      version          : VERSION,
      chainId          : order.chainId,
      verifyingContract,
    },
    message    : order,
    primaryType: 'Order',
  };

  let signature;
  try {
    /* if (!window.ethereum || !window.ethereum.isMetaMask) {
      // if not using metamask use signEth
      throw new Error('using eth_sign');
    } */
    signature = await signTypedData(provider, from, typedData);
  } catch (err) {
    // HACK: We are unable to handle specific errors thrown since provider is not an object
    //       under our control. It could be Metamask Web3, Ethers, or any general RPC provider.
    //       We check for a user denying the signature request in a way that supports Metamask and
    //       Coinbase Wallet. Unfortunately for signers with a different error message,
    //       they will receive two signature requests.
    if (err.message.includes('User denied message signature')) {
      throw err;
    }
    signature = await signEth(provider, from, typedData);
  }
  if (!signature) {
    throw new Error('No Signature');
  }

  const ecSignatureRSV = signTypedDataUtils.parseSignatureHexAsRSV(signature);
  const signatureBuffer = Buffer.concat([
    toBuffer(ecSignatureRSV.v),
    toBuffer(ecSignatureRSV.r),
    toBuffer(ecSignatureRSV.s),
    toBuffer(2),
  ]);
  const signatureHex = `0x${signatureBuffer.toString('hex')}`;

  return { ...order, signature: signatureHex };
};
