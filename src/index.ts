import api from './api';
import transactions from './transactions';
import sign from './signature';

interface Test {
  test: string
}

const nftdaoSDK = ({
  marketplaceId,
}) => {
  let web3;
  const _transactions = transactions(marketplaceId);
  const setWeb3 = async (_web3) => {
    web3 = _web3;
    await _transactions.setWeb3(_web3);
  };
  return {
    api: api,
    transactions: _transactions,
    sign,
    test      : (payload: Test) => console.log(payload),
    setWeb3,
  }
};

export default nftdaoSDK;
