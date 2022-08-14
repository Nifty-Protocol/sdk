import {
  ImmutableXClient, Link, ERC721TokenType, ETHTokenType,
} from '@imtbl/imx-sdk';
import { IMMUTABLEX } from './chains';

export const ImmutableXLinkAddress = 'https://link.x.immutable.com';
export const ImmutableXApiAddress = 'https://api.x.immutable.com/v1';

// Ropsten Testnet
// export const ImmutableXLinkAddress = 'https://link.ropsten.x.immutable.com';
// export const ImmutableXApiAddress = 'https://api.ropsten.x.immutable.com/v1';

// configure link , client and address
export const buildLinkImmutableX = async () => {
  // getting user from localstorage if exists
  let address = localStorage.getItem('WALLET_ADDRESS');

  if (!address) {
    // Link SDK
    const link = new Link(ImmutableXLinkAddress);
    const res = await link.setup({});

    address = res.address;
    // saving user to localstorage
    localStorage.setItem('WALLET_ADDRESS', res.address);
    localStorage.setItem('STARK_PUBLIC_KEY', res.starkPublicKey);
  }

  // IMX Client
  const client = await ImmutableXClient.build({ publicApiUrl: ImmutableXApiAddress });

  return { ...client, chainType: IMMUTABLEX };
};
