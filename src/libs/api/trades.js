"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httpRequest_1 = require("../utils/httpRequest");
var config_1 = require("../../config");
var TRADES = "".concat(config_1.default.api, "trades");
var getStats = function (params) {
    if (params === void 0) { params = {}; }
    return (0, httpRequest_1.default)({ url: "".concat(TRADES, "/stats/"), params: params });
};
var getAll = function (data) { return (0, httpRequest_1.default)({
    url: "".concat(TRADES),
}); };
var getGraph = function (params) {
    if (params === void 0) { params = {}; }
    return (0, httpRequest_1.default)({
        url: "".concat(TRADES, "/graph"),
        params: params,
    });
};
exports.default = {
    getStats: getStats,
    getAll: getAll,
    getGraph: getGraph,
};
//# sourceMappingURL=trades.js.map