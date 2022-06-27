import { PROD, TESTNET,LOCAL } from "./constants"

export default {
    api: {
        [PROD]: 'https://api.nftrade.com/api/v1/',
        [TESTNET]: 'https://api-testnets.nftrade.com/api/v1/',
        [LOCAL]: 'http://localhost:4040/api/v1/'
    }
}