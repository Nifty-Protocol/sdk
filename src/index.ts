import api from './api';
import transactions from './transactions';
import sign from './signature';
import { setWallet } from './wallet/setWallet';
import { findChainById } from './utils/chain';

interface Test {
  test: string
}

const nftdaoSDK = ({
  marketplaceId,
}) => {
  let data;
  const _transactions = transactions(marketplaceId);

  const setWeb3 = async (provider: any, providerType: 'EVM' | 'immutablex' | 'solana') => {
    await setWallet(provider, providerType);
    await _transactions.setWalletData(data);
  };

  return {
    api: api,
    transactions: _transactions,
    sign,
    findChain:(chain :number) => findChainById(chain),
    test: (payload: Test) => console.log(payload),
    setWeb3,
  }
};

export default nftdaoSDK;
