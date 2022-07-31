import { providers } from "ethers";

export interface Wallet {
    provider: providers.Provider;
    web3: any;
    getUserAddress(): Promise<string>;
    chainId(): Promise<string>;
    getBalance(address: string): Promise<string>
    blockchainFormatDigit(number: number): string;
}
