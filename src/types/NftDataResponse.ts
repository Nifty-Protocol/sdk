export interface Transfers {
  from: TransferId;
  to: TransferId;
  timestamp: string;
  transaction: TransferId;
  type?: string;
  price?: string;
  icon?: string;
}

export interface Balances {
  account: {
    id: string
  };
  value: string;
}

interface TransferId {
  id: string;
}
