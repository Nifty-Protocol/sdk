const INTERVAL = 200;
/**
 * @param {!string | !Array.<!string>} txHash, a transaction hash or an array of transaction hashes.
 * @param {Number} interval, in seconds.
 * @returns {!Promise.<!object> | !Promise.<!Array.<!object>>} the receipt or an array of receipts.
 */
const transactionConfirmation = (web3, txnHash) => new Promise((resolve, reject) => {
  const transactionReceiptRetry = () => web3.eth.getTransactionReceipt(txnHash)
    .then((receipt) => (receipt && receipt.blockNumber
      ? resolve(receipt)
      : setTimeout(() => {
        transactionReceiptRetry();
      }, INTERVAL)));
  transactionReceiptRetry();
});

export default transactionConfirmation;
