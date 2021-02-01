import axios, {AxiosRequestConfig, Method} from 'axios'
import {Content, ContentOptions} from './Content';
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

    postKeys = async(content: Content): Promise<void> => {
        var data = {
            "resource_id": content.id,
            "cost": content.price,
            "dkey": content.key
        }
        const res = await this.request(`${this.ZephyrUrl}/resource`, 'POST', {data})
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




