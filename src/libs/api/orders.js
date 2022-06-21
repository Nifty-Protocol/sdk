"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpRequest_1 = require("../utils/HttpRequest");
var config_1 = require("../../config");
var URL = "".concat(config_1.default.api, "orders");
var create = function (data) { return (0, HttpRequest_1.default)({ url: URL, method: 'post', data: data }); };
var get = function (id) { return (0, HttpRequest_1.default)({ url: "".concat(URL, "/").concat(id) }); };
var cancel = function (id) { return (0, HttpRequest_1.default)({ url: "".concat(URL, "/").concat(id, "/cancel"), method: 'put' }); };
exports.default = {
    create: create,
    get: get,
    cancel: cancel,
};
//# sourceMappingURL=orders.js.map