export interface Wallet {
    provider: any;
    getUserAddress(): Promise<string>;
    chainId(): Promise<string>;
    getBalance(address: string): Promise<string>
    blockchainFormatDigit(number: number): string;
}
