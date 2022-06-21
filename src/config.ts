import { PROD, TESTNET } from "./constants"

export default {
    api: {
        [PROD]: 'https://api.nftrade.com/api/v1/',
        [TESTNET]: 'https://api-testnets.nftrade.com/api/v1/'
    }
}