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
const fs_1 = require("fs");
const rand_token_1 = require("rand-token");
const sha256 = require("crypto-js/sha256");
const hmacSHA512 = require("crypto-js/hmac-sha512");
const Base64 = require("crypto-js/enc-base64");
const Crypto = require("crypto-js");
class Zephyr {
    constructor(options) {
        this.getToken = () => __awaiter(this, void 0, void 0, function* () {
            const nonce = rand_token_1.uid(16);
            const hash = sha256(nonce + this.clientID);
            const hmac = Base64.stringify(hmacSHA512(hash, this.clientKey));
            var data = {
                "client_id": this.clientID,
                "nonce": nonce,
                "hmac": hmac
            };
            //const res = await this.request(`${this.ZephyrUrl}/clientaccount`, 'POST', {data})
        });
        this.postKeys = (content) => __awaiter(this, void 0, void 0, function* () {
            var data = {
                "resource_id": content.id,
                "cost": content.price,
                "dkey": content.key
            };
            const res = yield this.request(`${this.ZephyrUrl}/resource`, 'POST', { data });
        });
        this.generateHTML = (content) => {
            let output = `
        <div class="zephyr-content" data-content-id="${content.id}">
            <div class="zephyr-content-header">
            <div class="zephyr-name">${content.name}</div>
            <div class="zephyr-price">${content.price}</div>
            <div class="zephyr-description">${content.description}</div>
            <div class="zephyr-cipher" cipher-content="${content.content}"></div>
            <img src="data:image/jpeg;base64,${content.content}" alt="" />
        </div>`;
            return output;
        };
        this.generateID = () => {
            var id = rand_token_1.uid(16);
            return id;
        };
        this.encryptText = (text, key) => {
            var cipher = Crypto.AES.encrypt(text, key).toString();
            return cipher;
        };
        this.encryptImage = (file, key) => {
            var file_base64 = fs_1.readFileSync(file, 'base64');
            var cipher = this.encryptText(file_base64, key);
            return cipher;
        };
        this.encryptLocalFile = (file, key) => {
            var file_utf = fs_1.readFileSync(file, 'utf-8');
            var cipher = this.encryptText(file_utf, key);
            return cipher;
        };
        this.encrypt = (content, key) => {
            var cipher = this.encryptLocalFile(content, key);
            return cipher;
        };
        this.createContent = (options) => {
            var content = {
                id: this.generateID(),
                name: options.name,
                description: options.description,
                price: options.price,
                key: rand_token_1.uid(32),
                content: options.content,
                output: null
            };
            content.content = this.encrypt(content.content, content.key);
            content.output = this.generateHTML(content);
            this.postKeys(content);
            return content;
        };
        this.clientID = options.clientID;
        this.clientKey = options.clientKey;
        this.ZephyrUrl = "http://54.244.63.140:8080";
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
}
exports.Zephyr = Zephyr;
//# sourceMappingURL=zephyr.js.map