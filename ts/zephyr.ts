import axios, {AxiosRequestConfig, Method} from 'axios';
import {readFileSync} from 'fs';
import {ClientData, AccessTokenData, Content, ContentOptions} from './DataTypes';
import {uid} from 'rand-token';
import {AES} from 'crypto-ts';

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

    private getToken() {
        //TODO: authorization method with Zephyr API
        return true; // placeholder
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
            <div class="zephyr-name">Name: ${content.name}</div>
            <div class="zephyr-description">Description: ${content.description}</div>
            <div class="zephyr-price">Price: ${content.price}</div>
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
        var cipher = AES.encrypt(text, key).toString();
        return cipher;
    }

    private encryptImage = (file: string, key: string): string => {
        var file_base64 = readFileSync(file, 'base64');
        var cipher = this.encryptText(file_base64, key);
        return cipher;
    }

    private encrypt = (content: any, key: string): string => {
        var cipher = this.encryptImage(content, key);
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

        content.content = this.encrypt(content.content, content.key)
        content.output = this.generateHTML(content)
        return content;
    }

}



