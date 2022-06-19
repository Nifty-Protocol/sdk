import api from './api';
import transactions from './transactions';
import sign from './signature';
import { setWallet } from './wallet/setWallet';

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
    test: (payload: Test) => console.log(payload),
    setWeb3,
  }
};

export default nftdaoSDK;
