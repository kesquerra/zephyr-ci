import axios, {AxiosRequestConfig, Method} from 'axios'
import {Content, ContentOptions } from './types/Content';
import {uid} from 'rand-token';
import {AES} from 'crypto-ts';

export = class Zephyr {
    public clientID: string;
    public clientKey: string;
    public ZephyrUrl: string;
    private accessToken?: AccessTokenData;
    private accessTokenPromise: Promise<void>

    constructor (options: ClientData) {
        this.clientID = options.clientID;
        this.clientKey = options.clientKey
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

    private encryptText(data:Partial<ContentOptions>) {
        var cipher = AES.encrypt(data.content, data.key);
        return cipher;
    }

    //TODO: encryption for different types of content

    async createContent (data:Partial<ContentOptions>) : Promise<Content> {
        const key = uid(16);
        data.key = key;
        const res = await this.request(`${this.ZephyrUrl}/content/create`, 'POST', {data})

        //TODO: add additional branching for different types of content
        res.data.cipher = this.encryptText(data)
        return res.data
    }

}

interface ClientData {
    clientID: string;
    clientKey: string;
}

interface AccessTokenData {
    value: string;
    expiration: number;
}
