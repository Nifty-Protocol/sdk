import { useEffect, useState } from 'react';  
import Web3 from 'web3';
import nftradeSDK from 'nftrade-sdk';

let sdk;

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [wallet, setWallet] = useState({});
  const [tokens, setTokens] = useState([]);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        const account = userAccount[0];
        setWallet({web3, account, chainId});
        setIsConnected(true);
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      );
    }
  };

  useEffect(() => {
    sdk = nftradeSDK({env: 'testnet'});
    sdk.api.tokens.getAll({
      sort: 'listed_desc'
    }).then((res) => {
      setTokens(res.data);
    })
  }, []);

  const buy = (orderId) => {
    sdk.api.orders.get(orderId).then((res) => {
      console.log(res.data);
      console.log(wallet.web3);
      const transaction = new sdk.Transaction({
        web3: wallet.web3,
        provider: wallet.web3.currentProvider,
        address: wallet.account,
        chainId: wallet.chainId,
        networkId: wallet.chainId,
      });
      transaction.buy(res.data);
      debugger;
    })
    sdk.test({test: orderId});
    console.log()
  }

  return (
    <div>
      {!isConnected && (
        <div>
          <button onClick={onConnect}>
            Connect to MetaMask
          </button>
        </div>
      )}
      <hr />
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {
          tokens.map((token) => <Token {...token} onBuy={() => buy(token.orderId)} />)
        }
      </div>
    </div>
  );
}

const Token = ({contract, name, thumb, price, onBuy}) => (
  <div style={{border: '1px solid', padding: '10px', margin: '10px  '}}>
    <div style={{
      width: '200px',
      height: '200px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <img src={thumb} alt="" style={{maxWidth: '100%', maxHeight: '100%'}} />
    </div>
    <h3>{contract.name}</h3>
    <h5>{name}</h5>
    <p>{price}</p>
    <button onClick={() => onBuy()}>BUY</button>
  </div>
)


export default App;