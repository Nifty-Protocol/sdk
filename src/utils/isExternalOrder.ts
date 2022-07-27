import { ExternalOrder } from "../types";

export const isExternalOrder = (order: any): order is ExternalOrder => {
  return !!order.source;
}