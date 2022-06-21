"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpRequest_1 = require("../utils/HttpRequest");
var config_1 = require("../../config");
var URL = "".concat(config_1.default.api, "users");
var get = function (token, id, params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({
        url: "".concat(URL, "/").concat(id),
        headers: {
            'x-access-token': token,
            'Content-Type': 'multipart/form-data',
        },
        method: 'get',
        params: params,
    });
};
var getAll = function (params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL), params: params });
};
var getByAddress = function (userAddress) { return (0, HttpRequest_1.default)({ url: "".concat(URL, "/address/").concat(userAddress) }); };
var count = function (params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL, "/get/count"), params: params });
};
exports.default = {
    get: get,
    getAll: getAll,
    getByAddress: getByAddress,
    count: count,
};
//# sourceMappingURL=users.js.map