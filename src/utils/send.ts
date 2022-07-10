import Emitter from '../../src/utils/emitter';

const send = (method, options) => new Promise(async (resolve, reject) => {
  const rejectIfUserRejected = (e) => {
    const userRejected = e.code === 4001;
    if (userRejected) {
      console.log('user rejected');
      reject(e);
    }
    return userRejected;
  };
  const _options = { ...options };
  try {
    const gas = await method.estimateGas(options);
    _options.gasLimit = gas * 3;
  } catch (error) {
    console.error(error);
  }
  console.log('normal transaction');
  method.send(_options)
    .on('transactionHash', (txHash) => { Emitter.emit('tnxHash', txHash) })
    .then((txHash) => {
      Emitter.emit('TransactionConfirmed')
      resolve(txHash)
    })
    .catch((e) => {
      if (!rejectIfUserRejected(e)) {
        console.log('0x2 transaction');
        method.send({
          ...options,
          type: '0x2',
        })
          .on('transactionHash', (txHash) => { Emitter.emit('tnxHash', txHash) })
          .then((txHash) => resolve(txHash))
          .catch((e2) => {
            if (!rejectIfUserRejected(e2)) {
              console.log('0x0 transaction');
              method.send({
                ...options,
                type: '0x0',
                maxFeePerGas: null,
                maxPriorityFeePerGas: null,
              })
                .on('transactionHash', (txHash) => { Emitter.emit('tnxHash', txHash) })
                .then((txHash) => resolve(txHash))
                .catch((e3) => reject(e3));
            }
          });
      }
    });
});

export default send;
