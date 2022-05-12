import { useEffect, useState } from 'react';  
import nftradeSDK from 'nftrade-sdk';

const App = () => {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const sdk = nftradeSDK({});
    sdk.test({test: 'hey'});
    sdk.api.tokens.getAll({
      sort: 'listed_desc'
    }).then((res) => {
      setTokens(res.data);
    })
  }, []);
  return (
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      {
        tokens.map((token) => <Token {...token} />)
      }
    </div>
  );
}

const Token = ({contract, name, thumb}) => (
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
  </div>
)


export default App;