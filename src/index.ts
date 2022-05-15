import api from './api';
import Transaction from './transactions';

interface Test {
  test: string
}

const nftradeSDK = ({
  
}) => ({
  api,
  Transaction,
  test      : (payload: Test) => console.log(payload),
});

export default nftradeSDK;
