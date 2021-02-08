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
exports.ContentCreator = void 0;
const rand_token_1 = require("rand-token");
const crypto_ts_1 = require("crypto-ts");
const fs_1 = require("fs");
class ContentCreator {
    constructor(content) {
        this.showContent = () => {
            let output = `
        <div class="zephyr-content" data-content-id="${this.content.id}">
            <div class="zephyr-name">Name: ${this.content.name}</div>
            <div class="zephyr-description">Description: ${this.content.description}</div>
            <div class="zephyr-price">Price: ${this.content.price}</div>
            <div class="zephyr-cipher" cipher-content="${this.content.content}"></div>
            <img src="data:image/jpeg;base64,${this.content.content}" alt="" />
        </div>`;
            return output;
        };
        this.generateID = () => {
            var id = rand_token_1.uid(16);
            this.content.id = id;
        };
        this.encryptText = (text) => {
            var key = rand_token_1.uid(32);
            var cipher = crypto_ts_1.AES.encrypt(text, key);
            this.content.content = cipher;
            console.log(key); //for testing purposes only
        };
        this.encryptImage = (filePath) => {
            var file = fs_1.readFileSync(filePath, 'base64');
            this.content.content = file;
            //this.encryptText(file)
        };
        this.getContent = (id, url) => __awaiter(this, void 0, void 0, function* () {
            const data = yield fetch(url);
            const content = yield data.json();
            const contentDetails = {
                id: content.id,
                name: content.name,
                description: content.description,
                price: content.price,
                cipher: content.content
            };
            this.showContent();
        });
        this.content = content;
        this.generateID();
        this.encryptImage(content.content);
        this.output = this.showContent();
    }
}
exports.ContentCreator = ContentCreator;
//# sourceMappingURL=zephyr-client.js.map