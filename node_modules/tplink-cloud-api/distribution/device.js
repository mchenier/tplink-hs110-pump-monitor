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
var api_utils_1 = require("./api-utils");
var TPLinkDevice = /** @class */ (function () {
    function TPLinkDevice(tpLink, deviceInfo) {
        if (!tpLink) {
            throw new Error("missing required parameter tpLink");
        }
        else if (!deviceInfo) {
            throw new Error("missing required paramemter deviceInfo");
        }
        else if (typeof deviceInfo !== "object") {
            throw new Error("invalid type passed for deviceInfo, expected object.");
        }
        this.device = deviceInfo;
        this.params = {
            appName: "Kasa_Android",
            termID: tpLink.termid,
            appVer: "1.4.4.607",
            ospf: "Android+6.0.1",
            netType: "wifi",
            locale: "es_ES",
            token: tpLink.token
        };
        this.genericType = "device";
    }
    Object.defineProperty(TPLinkDevice.prototype, "firmwareVersion", {
        get: function () {
            return this.device.fwVer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TPLinkDevice.prototype, "role", {
        get: function () {
            return this.device.role;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TPLinkDevice.prototype, "mac", {
        get: function () {
            return this.device.deviceMac;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TPLinkDevice.prototype, "model", {
        get: function () {
            return this.device.deviceModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TPLinkDevice.prototype, "type", {
        get: function () {
            return this.device.deviceType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TPLinkDevice.prototype, "name", {
        get: function () {
            return this.device.deviceName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TPLinkDevice.prototype, "disconnected", {
        get: function () {
            return this.status !== 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TPLinkDevice.prototype, "connected", {
        get: function () {
            return this.status === 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TPLinkDevice.prototype, "status", {
        get: function () {
            return this.device.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TPLinkDevice.prototype, "humanName", {
        get: function () {
            return this.device.alias;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TPLinkDevice.prototype, "alias", {
        get: function () {
            return this.device.alias;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TPLinkDevice.prototype, "id", {
        get: function () {
            return this.device.deviceId;
        },
        enumerable: true,
        configurable: true
    });
    TPLinkDevice.prototype.getDeviceId = function () {
        return this.device.deviceId;
    };
    Object.defineProperty(TPLinkDevice.prototype, "appServerUrl", {
        get: function () {
            return this.device.appServerUrl;
        },
        enumerable: true,
        configurable: true
    });
    TPLinkDevice.prototype.getSystemInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.passthroughRequest({ system: { get_sysinfo: {} } })];
                    case 1:
                        r = _a.sent();
                        return [2 /*return*/, r.system.get_sysinfo];
                }
            });
        });
    };
    /* send a device-specific request */
    TPLinkDevice.prototype.tplink_request = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO remove
                return [2 /*return*/, this.passthroughRequest(command)];
            });
        });
    };
    TPLinkDevice.prototype.passthroughRequest = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = {
                            method: "POST",
                            url: this.device.appServerUrl,
                            params: this.params,
                            headers: {
                                "cache-control": "no-cache",
                                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/M4B30X)"
                            },
                            data: {
                                method: "passthrough",
                                params: {
                                    deviceId: this.device.deviceId,
                                    requestData: JSON.stringify(command)
                                }
                            }
                        };
                        return [4 /*yield*/, axios_1.default(request)];
                    case 1:
                        response = _a.sent();
                        api_utils_1.checkError(response);
                        // eg: {"error_code":0,"result":{"responseData":"{\"smartlife.iot.smartbulb.lightingservice\":{\"get_light_state\":{\"on_off\":0,\"dft_on_state\":{\"mode\":\"normal\",\"hue\":0,\"saturation\":0,\"color_temp\":2700,\"brightness\":10},\"err_code\":0}}}"}}
                        return [2 /*return*/, response.data &&
                                response.data.result &&
                                response.data.result.responseData
                                ? JSON.parse(response.data.result.responseData)
                                : response.data];
                }
            });
        });
    };
    return TPLinkDevice;
}());
exports.default = TPLinkDevice;
