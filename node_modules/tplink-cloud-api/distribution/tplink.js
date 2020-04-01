"use strict";
/**
 * @package     tplink-cloud-api
 * @author      Alexandre Dumont <adumont@gmail.com>
 * @copyright   (C) 2017 - Alexandre Dumont
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt
 * @link        http://itnerd.space
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* This file is part of tplink-cloud-api.

tplink-cloud-api is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

tplink-cloud-api is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
tplink-cloud-api. If not, see http://www.gnu.org/licenses/. */
var axios_1 = __importDefault(require("axios"));
var uuid_1 = require("uuid");
var api_utils_1 = require("./api-utils");
var device_1 = __importDefault(require("./device"));
var hs100_1 = __importDefault(require("./hs100"));
var hs110_1 = __importDefault(require("./hs110"));
var hs200_1 = __importDefault(require("./hs200"));
var lb100_1 = __importDefault(require("./lb100"));
var lb130_1 = __importDefault(require("./lb130"));
function login(user, passwd, termid) {
    if (termid === void 0) { termid = uuid_1.v4(); }
    return __awaiter(this, void 0, void 0, function () {
        var request, response, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user) {
                        throw new Error("missing required user parameter");
                    }
                    else if (!passwd) {
                        throw new Error("missing required password parameter");
                    }
                    request = {
                        method: "POST",
                        url: "https://wap.tplinkcloud.com",
                        params: {
                            appName: "Kasa_Android",
                            termID: termid,
                            appVer: "1.4.4.607",
                            ospf: "Android+6.0.1",
                            netType: "wifi",
                            locale: "es_ES"
                        },
                        data: {
                            method: "login",
                            url: "https://wap.tplinkcloud.com",
                            params: {
                                appType: "Kasa_Android",
                                cloudPassword: passwd,
                                cloudUserName: user,
                                terminalUUID: termid
                            }
                        },
                        headers: {
                            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/M4B30X)"
                        }
                    };
                    return [4 /*yield*/, axios_1.default(request)];
                case 1:
                    response = _a.sent();
                    api_utils_1.checkError(response);
                    token = response.data.result.token;
                    return [2 /*return*/, new TPLink(token, termid)];
            }
        });
    });
}
exports.login = login;
var TPLink = /** @class */ (function () {
    function TPLink(token, termid) {
        if (termid === void 0) { termid = uuid_1.v4(); }
        this.token = token;
        this.termid = termid;
    }
    TPLink.prototype.getTermId = function () {
        return this.termid;
    };
    TPLink.prototype.getToken = function () {
        return this.token;
    };
    TPLink.prototype.getDeviceList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = {
                            method: "POST",
                            url: "https://wap.tplinkcloud.com",
                            params: {
                                appName: "Kasa_Android",
                                termID: this.termid,
                                appVer: "1.4.4.607",
                                ospf: "Android+6.0.1",
                                netType: "wifi",
                                locale: "es_ES",
                                token: this.token
                            },
                            headers: {
                                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/M4B30X)"
                            },
                            data: { method: "getDeviceList" }
                        };
                        return [4 /*yield*/, axios_1.default(request)];
                    case 1:
                        response = _a.sent();
                        api_utils_1.checkError(response);
                        return [2 /*return*/, (this.deviceList = response.data.result.deviceList)];
                }
            });
        });
    };
    // factory to return a new device object from a name (alias) or info object, { deviceType: ..., deviceModel: ... }
    TPLink.prototype.newDevice = function (nameOrInfo) {
        if (!nameOrInfo) {
            throw new Error("missing required parameter nameOrInfo");
        }
        else if (typeof nameOrInfo !== "string" &&
            typeof nameOrInfo !== "object") {
            throw new Error("invalid parameter type provided for nameOrInfo; expected string or object");
        }
        var deviceInfo = nameOrInfo;
        if (typeof nameOrInfo === "string") {
            deviceInfo = this.findDevice(nameOrInfo);
        }
        // https://github.com/plasticrake/tplink-smarthome-api/blob/master/src/device/index.js#L113
        var type = deviceInfo.deviceType.toLowerCase();
        var model = deviceInfo.deviceModel;
        if (type.includes("bulb")) {
            if (model && model.includes("130")) {
                return new lb130_1.default(this, deviceInfo);
            }
            return new lb100_1.default(this, deviceInfo);
        }
        if (type.includes("plug")) {
            if (model && model.includes("110")) {
                return new hs110_1.default(this, deviceInfo);
            }
            return new hs100_1.default(this, deviceInfo);
        }
        if (type.includes("switch")) {
            if (model && model.includes("200")) {
                return new hs200_1.default(this, deviceInfo);
            }
        }
        return new device_1.default(this, deviceInfo);
    };
    TPLink.prototype.findDevice = function (alias) {
        var deviceInfo;
        if (alias && this.deviceList) {
            deviceInfo = this.deviceList.find(function (d) { return d.alias === alias; });
        }
        if (!deviceInfo) {
            throw new Error("invalid alias: not found in device list");
        }
        return deviceInfo;
    };
    // for an HS100 smartplug
    TPLink.prototype.getHS100 = function (alias) {
        return new hs100_1.default(this, this.findDevice(alias));
    };
    // for an HS110 smartplug
    TPLink.prototype.getHS110 = function (alias) {
        return new hs110_1.default(this, this.findDevice(alias));
    };
    // for an HS200 smart switch
    TPLink.prototype.getHS200 = function (alias) {
        return new hs200_1.default(this, this.findDevice(alias));
    };
    // for an LB100, LB110 & LB120
    TPLink.prototype.getLB100 = function (alias) {
        return new lb100_1.default(this, this.findDevice(alias));
    };
    TPLink.prototype.getLB110 = function (alias) {
        return this.getLB100(alias);
    };
    TPLink.prototype.getLB120 = function (alias) {
        return this.getLB100(alias);
    };
    // for an LB130 lightbulb
    TPLink.prototype.getLB130 = function (alias) {
        return new lb130_1.default(this, this.findDevice(alias));
    };
    return TPLink;
}());
exports.default = TPLink;
