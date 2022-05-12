import api from './libs/api';

interface Test {
  test: string
}

const nftradeSDK = ({
  
}) => ({
  api,
  test      : (payload: Test) => console.log(payload),
});

export default nftradeSDK;
