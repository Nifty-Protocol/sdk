import { AxiosResponse } from "axios";

interface ExternalOrder {
  get: (id: string | number) => Promise<AxiosResponse>;
}

interface Orders {
  create: (data: object) => Promise<AxiosResponse>;
  get: (id: string | number) => Promise<AxiosResponse>;
  cancel: (id: string) => Promise<AxiosResponse>;
}

interface Tokens {
  get: (contractAddress: string, tokenID: number | number, params: object) => Promise<AxiosResponse>;
  refresh: (id: string, params: object) => Promise<AxiosResponse>;
  getOwner: (params: object) => Promise<AxiosResponse>;
  getGraph: (params: object) => Promise<AxiosResponse>;
  traits: (id: string, params: object) => Promise<AxiosResponse>;
  getAll: (params: object) => Promise<AxiosResponse>;
  report: (data: object) => Promise<AxiosResponse>;
}

interface Trades {
  getAll: () => Promise<AxiosResponse>;
  getStats: (params: object) => Promise<AxiosResponse>;
  getGraph: (params: object) => Promise<AxiosResponse>;
}

export interface Api {
  externalOrders: ExternalOrder;
  orders: Orders;
  tokens: Tokens;
  trades: Trades;
}