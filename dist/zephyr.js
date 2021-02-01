"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zephyr = void 0;
const axios_1 = require("axios");
const rand_token_1 = require("rand-token");
const crypto_ts_1 = require("crypto-ts");
class Zephyr {
    constructor(options) {
        this.clientID = options.clientID;
        this.clientKey = options.clientKey;
        this.accessTokenPromise = null;
    }
    request(url, method, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.accessTokenPromise)
                yield this.accessTokenPromise;
            if (!this.accessToken || ((_a = this.accessToken) === null || _a === void 0 ? void 0 : _a.expiration) <= Date.now())
                yield this.getToken();
            //TODO: add token value
            const value = yield axios_1.default(url, Object.assign({ method }, options
            //add token
            ));
            return value;
        });
    }
    getToken() {
        //TODO: authorization method with Zephyr API
        return true; // placeholder
    }
    encryptText(data) {
        var cipher = crypto_ts_1.AES.encrypt(data.content, data.key);
        return cipher;
    }
    //TODO: encryption for different types of content
    createContent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = rand_token_1.uid(16);
            data.key = key;
            const res = yield this.request(`${this.ZephyrUrl}/content/create`, 'POST', { data });
            //TODO: add additional branching for different types of content
            res.data.cipher = this.encryptText(data);
            return res.data;
        });
    }
}
exports.Zephyr = Zephyr;
//# sourceMappingURL=zephyr.js.map