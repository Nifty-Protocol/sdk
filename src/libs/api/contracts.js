"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.getRoyalties = exports.update = exports.getTraits = exports.byAddress = exports.count = exports.get = exports.getAll = void 0;
var HttpRequest_1 = require("../utils/HttpRequest");
var config_1 = require("../../config");
var URL = "".concat(config_1.default.api, "contracts");
var getAll = function (params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL), params: params });
};
exports.getAll = getAll;
var get = function (id) { return (0, HttpRequest_1.default)({ url: "".concat(URL, "/").concat(id) }); };
exports.get = get;
var count = function (params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL, "/get/count"), params: params });
};
exports.count = count;
var byAddress = function (chainId, address) { return (0, HttpRequest_1.default)({ url: "".concat(URL, "/").concat(chainId, "/").concat(address) }); };
exports.byAddress = byAddress;
var getTraits = function (id, params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL, "/").concat(id, "/traits"), params: params });
};
exports.getTraits = getTraits;
var update = function (token, id, data) {
    var formData = new FormData();
    Object.keys(data).forEach(function (key) {
        formData.append(key, data[key]);
    });
    return (0, HttpRequest_1.default)({
        url: "".concat(URL, "/").concat(id),
        data: formData,
        headers: {
            'x-access-token': token,
            'Content-Type': 'multipart/form-data',
        },
        method: 'put',
    });
};
exports.update = update;
var getRoyalties = function (contractId, params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({
        url: "".concat(URL, "/").concat(contractId, "/royalties"),
        params: params,
    });
};
exports.getRoyalties = getRoyalties;
var getStats = function (id, params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL, "/").concat(id, "/stats"), params: params });
};
exports.getStats = getStats;
exports.default = {
    getAll: exports.getAll,
    get: exports.get,
    update: exports.update,
    byAddress: exports.byAddress,
    getTraits: exports.getTraits,
    getRoyalties: exports.getRoyalties,
    count: exports.count,
    getStats: exports.getStats,
};
//# sourceMappingURL=contracts.js.map