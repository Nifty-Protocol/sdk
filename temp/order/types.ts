exports.orderStatuses = {
  ADDED    : 'ADDED',
  FILLED   : 'FILLED',
  CANCELLED: 'CANCELLED',
  EXPIRED  : 'EXPIRED',
  INVALID  : 'INVALID',
};

exports.orderTypes = {
  SELL : 'SELL',
  TRADE: 'TRADE',
  OFFER: 'OFFER',
};

exports.activityTypes = {
  LISTED         : 'LISTED',
  LIST_CANCELLED : 'LIST_CANCELLED',
  BOUGHT         : 'BOUGHT',
  SOLD           : 'SOLD',
  TRADE_OFFERED  : 'TRADE_OFFERED',
  TRADE_CANCELLED: 'TRADE_CANCELLED',
  TRADED         : 'TRADED',
  OFFER          : 'OFFER',
  OFFER_CANCELLED: 'OFFER_CANCELLED',
};

exports.tokenOrderTypes = {
  LISTING     : 'LISTING',
  OFFER       : 'OFFER',
  REJECT_OFFER: 'REJECT_OFFER',
  HISTORY     : 'HISTORY',
  TRADE       : 'TRADE',
  REJECT_TRADE: 'REJECT_TRADE',
};
