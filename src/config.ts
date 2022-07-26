import { PROD, TESTNET } from "./constants"

export default {
    api: {
        [PROD]: 'https://api.nftrade.com/api/v1/',
        [TESTNET]: 'http://localhost:4040/api/v1/',
    }
}