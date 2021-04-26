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
const hmacSHA512 = require("crypto-js/hmac-sha512");
const Crypto = require("crypto-js");
const jsdom_1 = require("jsdom");
class Zephyr {
    constructor(options) {
        this.buildHmac = () => {
            const non = rand_token_1.uid(16);
            const hmac = hmacSHA512(non, this.clientKey);
            let data = {
                id: this.clientID,
                nonce: non,
                time: Date.now(),
                signature: hmac.toString(Crypto.enc.Hex)
            };
            return data;
        };
        this.postKeys = (content) => __awaiter(this, void 0, void 0, function* () {
            let hmac = this.buildHmac();
            let config = {
                headers: {
                    "APP_ID": hmac.id,
                    "Nonce": hmac.nonce,
                    "Timestamp": hmac.time,
                    "Signature": hmac.signature
                },
                data: {
                    "resource_id": content.id,
                    "cost": content.price,
                    "dkey": content.key
                }
            };
            const res = yield this.request(`${this.ZephyrUrl}/resource`, 'POST', config);
        });
        this.generateHTML = (content) => {
            let output = `
        <div class="zephyr-content" data-content-id="${content.id}">
            <div class="zephyr-content-header">
                <div class="zephyr-name">${content.name}</div>
                <div class="zephyr-price">${content.price}</div>
            </div>
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
            var cipher = this.encryptText(content, key);
            return cipher;
        };
        this.convertContent = (input) => {
            var self = this;
            return new Promise(function (resolve, reject) {
                if (input.type == "fromURL") {
                    axios_1.default.get(`${input.content}`).then(res => {
                        const dom = new jsdom_1.JSDOM(res.data);
                        var node = dom.window.document.querySelector('article');
                        resolve(node.outerHTML);
                    });
                }
                else if (input.type == "fullPage") {
                    axios_1.default.get(`${input.content}`).then(res => {
                        const dom = new jsdom_1.JSDOM(res.data);
                        var scripts;
                        var count = 0;
                        dom.window.document.querySelectorAll('script').forEach(el => {
                            if (el.getAttribute('type') == 'text/javascript') {
                                if (count == 6) {
                                    scripts += el.outerHTML;
                                    var content = {
                                        id: self.generateID(),
                                        name: input.name,
                                        description: input.description,
                                        price: input.price,
                                        key: rand_token_1.uid(16),
                                        content: scripts,
                                        output: null
                                    };
                                    self.postKeys(content);
                                    content.content = self.encrypt(content.content, content.key);
                                    content.output = self.generateHTML(content);
                                    el.outerHTML = content.output;
                                }
                                else {
                                    scripts += el.outerHTML;
                                    el.parentElement.removeChild(el);
                                }
                            }
                        });
                        dom.window.document.querySelectorAll('div').forEach(el => {
                            if (el.getAttribute('class') == 'article__chunks') {
                                var content = {
                                    id: self.generateID(),
                                    name: input.name,
                                    description: input.description,
                                    price: input.price,
                                    key: rand_token_1.uid(16),
                                    content: el.outerHTML,
                                    output: null
                                };
                                self.postKeys(content);
                                content.content = self.encrypt(content.content, content.key);
                                content.output = self.generateHTML(content);
                                el.outerHTML = content.output;
                            }
                        });
                        var node = dom.window.document.querySelector('head');
                        var body = dom.window.document.querySelector('body');
                        resolve(node.innerHTML + "</head>" + body.outerHTML);
                    });
                }
                else if (input.type == "file") {
                    resolve(fs_1.readFileSync(input.content, 'utf-8'));
                }
                else {
                    resolve(input.content);
                }
            });
        };
        this.createContent = (input) => __awaiter(this, void 0, void 0, function* () {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.convertContent(input).then(text => {
                    var content = {
                        id: self.generateID(),
                        name: input.name,
                        description: input.description,
                        price: input.price,
                        key: rand_token_1.uid(16),
                        content: text,
                        output: null
                    };
                    if (input.type != "fullPage") {
                        content.content = self.encrypt(content.content, content.key);
                        content.output = self.generateHTML(content);
                    }
                    else {
                        content.output = content.content;
                    }
                    self.postKeys(content);
                    self.contents.push(content);
                    resolve(content);
                });
            });
        });
        this.getOutputs = (options) => {
            var self = this;
            return new Promise(function (resolve) {
                const result = options.map((content) => __awaiter(this, void 0, void 0, function* () {
                    return yield self.createContent(content);
                }));
                Promise.all(result).then(res => {
                    resolve(res);
                });
            });
        };
        this.clientID = options.clientID;
        this.clientKey = options.clientKey;
        this.ZephyrUrl = "http://54.244.63.140:8080";
        this.contents = [];
    }
    request(url, method, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield axios_1.default(url, Object.assign({ method }, options
            //add token
            ));
            return value;
        });
    }
}
exports.Zephyr = Zephyr;
//# sourceMappingURL=zephyr.js.map