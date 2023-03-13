
// chain types
export const EVM = 'evm';
export const IMMUTABLEX = 'immutablex';
export const SOLANA = 'solana';
export const XRPL = 'xrpl';

export type chainType = Array <{
  name            : string;
  chainId         : number;
  shortName       : string;
  chain           : string;
  chainIcon       : string;
  chainIconWrapper: string;
  network         : string;
  networkId       : number;
  chainType       : "evm" | "immutablex" | "solana" | "xrpl";
  greenPayFee?: number;
  hasGasless?: boolean;
  nativeCurrency  : any;
  explorer:  string;
}>;

const productionChains : chainType = [
  {
    name            : 'Ethereum',
    chainId         : 1,
    shortName       : 'eth',
    chain           : 'ETH',
    chainIcon       : '/img/chains/walletETH.svg',
    chainIconWrapper: '/img/chains/wrappedWalletETH.svg',
    network         : 'mainnet',
    networkId       : 1,
    chainType       : EVM,
    nativeCurrency  : {
      name               : 'Ether',
      symbol             : 'ETH',
      wrapped            : 'WETH',
      moonpayCurrenctCode: 'ETH',
      decimals           : 18,
      icon               : '/img/chains/currencyEth.svg',
    },
    explorer: 'https://etherscan.io',
  },
  {
    name            : 'BNB',
    chainId         : 56,
    shortName       : 'bsc',
    chain           : 'BNB',
    chainIcon       : '/img/chains/walletBNB.svg',
    chainIconWrapper: '/img/chains/wrappedWalletBNB.svg',
    network         : 'mainnet',
    networkId       : 56,
    greenPayFee     : 0.002,
    chainType       : EVM,
    nativeCurrency  : {
      name               : 'BNB Native Token',
      symbol             : 'BNB',
      wrapped            : 'WBNB',
      moonpayCurrenctCode: 'BNB_BSC',
      decimals           : 18,
      icon               : '/img/chains/currencyBnb.svg',
    },
    explorer: 'https://bscscan.com',
  },
  {
    name            : 'Polygon',
    chainId         : 137,
    shortName       : 'polygon',
    chain           : 'MATIC',
    chainIcon       : '/img/chains/walletMatic.svg',
    chainIconWrapper: '/img/chains/wrappedWalletMatic.svg',
    network         : 'mainnet',
    networkId       : 137,
    hasGasless      : true,
    chainType       : EVM,
    nativeCurrency  : {
      name               : 'Matic',
      symbol             : 'MATIC',
      wrapped            : 'WMATIC',
      moonpayCurrenctCode: 'MATIC_POLYGON',
      decimals           : 18,
      icon               : '/img/chains/currencyPolygon.svg',
    },
    explorer: 'https://polygonscan.com',
  },
  {
    name            : 'Avalanche',
    chainId         : 43114,
    shortName       : 'avalanche',
    chain           : 'AVAX',
    chainIcon       : '/img/chains/walletAvax.svg',
    chainIconWrapper: '/img/chains/wrappedWalletAvax.svg',
    network         : 'mainnet',
    networkId       : 1,
    chainType       : EVM,
    nativeCurrency  : {
      name               : 'Avalanche',
      symbol             : 'AVAX',
      wrapped            : 'WAVAX',
      moonpayCurrenctCode: 'AVAX_CCHAIN',
      decimals           : 18,
      icon               : '/img/chains/currencyAvax.svg',
    },
    explorer: 'https://snowtrace.io',
  },
  {
    name            : 'Moonriver',
    chainId         : 1285,
    shortName       : 'moonriver',
    chain           : 'MOVR',
    chainIcon       : '/img/chains/walletMvr.svg',
    chainIconWrapper: '/img/chains/walletMvr.svg',
    network         : 'mainnet',
    networkId       : 1285,
    chainType       : EVM,
    nativeCurrency  : {
      name    : 'Moonriver',
      symbol  : 'MOVR',
      wrapped : 'WMOVR',
      decimals: 18,
      icon    : '/img/chains/currencyMovr.svg',
    },
    explorer: 'https://moonriver.moonscan.io',
  },
  // {
  //   name             : 'Solana',
  //   chainId          : 1995,
  //   shortName        : 'solana',
  //   chain            : 'solana',
  //   chainIcon       : 'https://via.placeholder.com/150',
  //   chainIconWrapper: 'https://via.placeholder.com/150',
  //   network          : 'mainnet',
  //   networkId        : 1995,
  //   chainType        : SOLANA,
  //   nativeCurrency   : {
  //     name    : 'SOL',
  //     symbol  : 'SOL',
  //     wrapped : '',
  //     decimals: 10,
  //     icon    : '/currencySolana.svg',
  //   },
  //   explorer: '',
  // },
  {
    name             : 'ImmutableX',
    chainId          : 1997,
    shortName        : 'immutablex',
    chain            : 'ImmutableX',
    chainIcon       : '/img/chains/walletImx.svg',
    chainIconWrapper: '/img/chains/walletImx.svg',
    network          : 'mainnet',
    networkId        : 1997,
    chainType        : IMMUTABLEX,
    nativeCurrency   : {
      name    : 'IMX',
      symbol  : 'IMX',
      wrapped : '',
      decimals: 18,
      icon    : '/img/chains/currencyImx.svg',
    },
    explorer: 'https://immutascan.io',
  },
  /* {
    name             : 'Aurora',
    chainId          : 1313161554,
    shortName        : 'aurora',
    chain            : 'AURORA',
    chainIcon       : '/img/chains/walletAurora.svg',
    chainIconWrapper: '/img/chains/walletAurora.svg',
    network          : 'mainnet',
    networkId        : 1313161554,
    nativeDisabled   : true,
    nativeCurrency   : {
      name    : 'Aurora',
      symbol  : 'AURORA',
      wrapped : 'AURORA',
      decimals: 18,
      icon    : '/img/chains/currencyAurora.svg',
    },
    explorer: 'https://explorer.mainnet.aurora.dev',
  }, */
  {
    name            : 'Moonbeam',
    chainId         : 1284,
    shortName       : 'moonbeam',
    chain           : 'GLMR',
    chainIcon       : '/img/chains/walletGlmr.svg',
    chainIconWrapper: '/img/chains/walletGlmr.svg',
    network         : 'mainnet',
    networkId       : 1284,
    chainType       : EVM,
    nativeCurrency  : {
      name    : 'Moonbeam',
      symbol  : 'GLMR',
      wrapped : 'WGLMR',
      decimals: 18,
      icon    : '/img/chains/currencyGlmr.svg',
    },
    explorer: 'https://blockscout.moonbeam.network',
  },
  {
    name            : 'Rinkeby',
    chainId         : 4,
    shortName       : 'rin',
    chain           : 'ETH',
    chainIcon       : '/img/chains/walletETH.svg',
    chainIconWrapper: '/img/chains/wrappedWalletETH.svg',
    network         : 'testnet',
    networkId       : 4,
    chainType       : EVM,
    nativeCurrency  : {
      name               : 'Rinkeby Ether',
      symbol             : 'RIN',
      wrapped            : 'WRIN',
      moonpayCurrenctCode: 'RINKETH',
      decimals           : 18,
      icon               : '/img/chains/currencyEth.svg',
    },
    explorer: 'https://rinkeby.etherscan.io',
  },
  {
    name            : 'Avalanche FUJI',
    chainId         : 43113,
    shortName       : 'fuji',
    chain           : 'FUJI',
    chainIcon       : '/img/chains/walletAvax.svg',
    chainIconWrapper: '/img/chains/wrappedWalletAvax.svg',
    network         : 'testnet',
    networkId       : 43113,
    chainType       : EVM,
    nativeCurrency  : {
      name               : 'Avalanche FUJI',
      symbol             : 'AVAX',
      wrapped            : 'WAVAX',
      moonpayCurrenctCode: 'AVAX_FUJI_CCHAIN',
      decimals           : 18,
      icon               : '/img/chains/currencyAvax.svg',
    },
    explorer: 'https://testnet.snowtrace.io',
  },
];

// eslint-disable-next-line no-nested-ternary
// const chains = env.isProduction() ? productionChains : (
//   env.isTestnets() ? testnetsChains : [...productionChains, ...testnetsChains]
// );

export default productionChains;
