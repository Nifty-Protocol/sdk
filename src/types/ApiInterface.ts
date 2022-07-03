
interface ExternalOrder {
  get: (id: string | number) => any;
}

interface Orders {
  create: (data: object) => any;
  get: (id: string | number) => any;
  cancel: (id: string) => any;
}

interface Tokens {
  get: (contractAddress: string, tokenID: number | number, params: object) => any;
  refresh: (id: string, params: object) => any;
  getOwner: (params: object) => any;
  getGraph: (params: object) => any;
  traits: (id: string, params: object) => any;
  getAll: (params: object) => any;
  report: (data: object) => any;
}

interface Trades {
  getAll: () => any;
  getStats: (params: object) => any;
  getGraph: (params: object) => any;
}

export interface Api {
  externalOrders: ExternalOrder;
  orders: Orders;
  tokens: Tokens;
  trades: Trades;
}