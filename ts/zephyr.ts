import axios, {AxiosRequestConfig, Method} from 'axios';
import {readFileSync} from 'fs';
import {ClientData, AccessTokenData, Content, ContentOptions} from './DataTypes';
import {uid} from 'rand-token';
import sha256 = require('crypto-js/sha256')
import hmacSHA512 = require('crypto-js/hmac-sha512')
import Base64 = require('crypto-js/enc-base64')
import Crypto = require('crypto-js')

export class Zephyr {
    public clientID: string;
    public clientKey: string;
    public ZephyrUrl: string;
    private accessToken?: AccessTokenData;
    private accessTokenPromise: Promise<void>

    constructor (options: ClientData) {
        this.clientID = options.clientID;
        this.clientKey = options.clientKey
        this.ZephyrUrl = "http://54.244.63.140:8080"
        this.accessTokenPromise = null;
    }

    private async request (url: string, method: Method, options?: AxiosRequestConfig) {
        if (this.accessTokenPromise) await this.accessTokenPromise
        if (!this.accessToken || this.accessToken?.expiration <= Date.now()) await this.getToken()
        
        //TODO: add token value

        const value = await axios(url, {
            ...{method},
            ...options
            //add token
        })
        return value
    }

    private getToken = async(): Promise<void> => {
        const nonce = uid(16)
        const hash = sha256(nonce + this.clientID);
        const hmac = Base64.stringify(hmacSHA512(hash, this.clientKey))
        var data = {
            "client_id": this.clientID,
            "nonce": nonce,
            "hmac": hmac
        }
        //const res = await this.request(`${this.ZephyrUrl}/clientaccount`, 'POST', {data})
    }

    private postKeys = async(content: Content): Promise<void> => {
        var data = {
            "resource_id": content.id,
            "cost": content.price,
            "dkey": content.key
        }
        const res = await this.request(`${this.ZephyrUrl}/resource`, 'POST', {data})
    }

    private generateHTML = (content: Content): string => {
        let output: string = `
        <div class="zephyr-content" data-content-id="${content.id}">
            <div class="zephyr-content-header">
                <div class="zephyr-name">${content.name}</div>
                <div class="zephyr-price">${content.price}</div>
            </div>
            <div class="zephyr-description">${content.description}</div>
            <div class="zephyr-cipher" cipher-content="${content.content}"></div>
            <img src="data:image/jpeg;base64,${content.content}" alt="" />
        </div>`
        return output;
    }

    private generateID = (): string => {
        var id = uid(16);
        return id;
    }

    private encryptText = (text: string, key: string): string => {
        var cipher = Crypto.AES.encrypt(text, key).toString();
        return cipher;
    }

    private encryptImage = (file: string, key: string): string => {
        var file_base64 = readFileSync(file, 'base64');
        var cipher = this.encryptText(file_base64, key);
        return cipher;
    }

    private encryptLocalFile = (file: string, key: string): string => {
        var file_utf = readFileSync(file, 'utf-8');
        var cipher = this.encryptText(file_utf, key);
        return cipher;
    }

    private encrypt = (content: any, key: string): string => {
        var cipher = this.encryptLocalFile(content, key);
        return cipher;
    }

    public createContent = (options: ContentOptions): Content => {
        var content: Content = {
            id: this.generateID(),
            name: options.name,
            description: options.description,
            price: options.price,
            key: uid(32),
            content: options.content,
            output: null
        }

        content.content = this.encrypt(content.content, content.key);
        content.output = this.generateHTML(content);
        this.postKeys(content);
        return content;
    }

}



