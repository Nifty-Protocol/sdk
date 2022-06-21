"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomepageData = exports.getAll = exports.traits = exports.getGraph = exports.getOwner = exports.refresh = exports.get = void 0;
var HttpRequest_1 = require("../utils/HttpRequest");
var config_1 = require("../../config");
var URL = "".concat(config_1.default.api, "tokens");
var get = function (contractAddress, tokenID, params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL, "/").concat(contractAddress, "/").concat(tokenID), params: params });
};
exports.get = get;
var refresh = function (id, params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL, "/").concat(id, "/refresh"), params: params });
};
exports.refresh = refresh;
var getOwner = function (params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL, "/owner"), params: params });
};
exports.getOwner = getOwner;
var getGraph = function (params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL, "/graph"), params: params });
};
exports.getGraph = getGraph;
var traits = function (id, params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL, "/").concat(id, "/traits"), params: params });
};
exports.traits = traits;
var getAll = function (params) {
    if (params === void 0) { params = {}; }
    return (0, HttpRequest_1.default)({ url: "".concat(URL), params: params });
};
exports.getAll = getAll;
var getHomepageData = function () { return (0, HttpRequest_1.default)({ url: "".concat(URL, "/homepage") }); };
exports.getHomepageData = getHomepageData;
var report = function (data) { return (0, HttpRequest_1.default)({
    url: "".concat(URL, "/reports"),
    data: data,
    method: 'post',
}); };
exports.default = {
    get: exports.get,
    refresh: exports.refresh,
    getOwner: exports.getOwner,
    getGraph: exports.getGraph,
    traits: exports.traits,
    getAll: exports.getAll,
    report: report,
    getHomepageData: exports.getHomepageData,
};
//# sourceMappingURL=tokens.js.map