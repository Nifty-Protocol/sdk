"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var orders_1 = require("./orders");
var tokens_1 = require("./tokens");
var contracts_1 = require("./contracts");
var users_1 = require("./users");
var trades_1 = require("./trades");
var api = {
    orders: orders_1.default,
    tokens: tokens_1.default,
    contracts: contracts_1.default,
    users: users_1.default,
    trades: trades_1.default,
};
exports.default = api;
//# sourceMappingURL=index.js.map