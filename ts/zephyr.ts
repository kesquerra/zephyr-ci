import axios, {AxiosRequestConfig, Method} from 'axios';
import {readFileSync} from 'fs';
import {ClientData, Content, ContentOptions, HMAC} from './DataTypes';
import {uid} from 'rand-token';
import sha512 = require('crypto-js/sha512')
import hmacSHA512 = require('crypto-js/hmac-sha512')
import Base64 = require('crypto-js/enc-base64')
import Crypto = require('crypto-js')
import {JSDOM} from 'jsdom';

export class Zephyr {
    public clientID: string;
    public clientKey: string;
    public ZephyrUrl: string;
    public contents: Content[];
    public contentPromise: Promise<void>;

    //client construction
    constructor (options: ClientData) {
        this.clientID = options.clientID;
        this.clientKey = options.clientKey
        this.ZephyrUrl = "http://54.244.63.140:8080"
        this.contents = [];
    }

    // make requests (GET, POST, etc)
    private async request (url: string, method: Method, options?: AxiosRequestConfig) {

        const value = await axios(url, {
            ...{method},
            ...options
            //add token
        })
        return value
    }

    // create hmac signature
    private buildHmac = ():HMAC => {
        const non = uid(16);
        const hmac = hmacSHA512(non, this.clientKey)
        let data: HMAC = {
            id: this.clientID,
            nonce: non,
            time: Date.now(),
            signature: hmac.toString(Crypto.enc.Hex)
        }
        return data;
    }

    // construct appropriate hmac and send encryption keys to API
    private postKeys = async(content: Content): Promise<void> => {
        let hmac = this.buildHmac();
        let config: AxiosRequestConfig = {
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
        }
        const res = await this.request(`${this.ZephyrUrl}/resource`, 'POST', config);
    }

    // create HTML string for insertion of content in page
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

    // unique id for API
    private generateID = (): string => {
        var id = uid(16);
        return id;
    }

    // encrypt text inputs
    private encryptText = (text: string, key: string): string => {
        var cipher = Crypto.AES.encrypt(text, key).toString();
        return cipher;
    }

    // encrypt images by converting to base 64 and encrypting
    private encryptImage = (file: string, key: string): string => {
        var file_base64 = readFileSync(file, 'base64');
        var cipher = this.encryptText(file_base64, key);
        return cipher;
    }

    //encrypt local file by parsing to utf-8
    private encryptLocalFile = (file: string, key: string): string => {
        var file_utf = readFileSync(file, 'utf-8');
        var cipher = this.encryptText(file_utf, key);
        return cipher;
    }

    // cumulative encryption function for file type
    private encrypt = (content: any, key: string): string => {
        var cipher = this.encryptText(content, key);
        return cipher;
    }

    //convert input content to appropriate text
    private convertContent = (input: ContentOptions): Promise<string> => {
        var self = this
        return new Promise(function(resolve, reject) {
            // parse articles from external url
            if (input.type == "fromURL") {
                axios.get(`${input.content}`).then(res => {
                    const dom = new JSDOM(res.data)
                    var node = dom.window.document.querySelector('article')
                    resolve(node.outerHTML);
                })

            // demo specific functionality
            } else if (input.type == "fullPage") {
                axios.get(`${input.content}`).then(res => {
                    const dom = new JSDOM(res.data);
                    var scripts;
                    var count = 0;
                    dom.window.document.querySelectorAll('script').forEach(el => {
                        if (el.getAttribute('type') == 'text/javascript') {
                            if (count == 6) {
                                scripts += el.outerHTML;
                                var content: Content = {
                                    id: self.generateID(),
                                    name: input.name,
                                    description: input.description,
                                    price: input.price,
                                    key: uid(16),
                                    content: scripts,
                                    output: null
                                }
                                self.postKeys(content);
                                content.content = self.encrypt(content.content, content.key);
                                content.output = self.generateHTML(content);
                                el.outerHTML = content.output;
                            } else {
                                scripts += el.outerHTML;
                                el.parentElement.removeChild(el);
                            }
                        }
                    })
                    dom.window.document.querySelectorAll('div').forEach(el => {
                        if (el.getAttribute('class') == 'article__chunks') {
                            var content: Content = {
                                id: self.generateID(),
                                name: input.name,
                                description: input.description,
                                price: input.price,
                                key: uid(16),
                                content: el.outerHTML,
                                output: null
                            }
                            self.postKeys(content);
                            content.content = self.encrypt(content.content, content.key);
                            content.output = self.generateHTML(content);
                            el.outerHTML = content.output;
                        }
                    })
                    var node = dom.window.document.querySelector('head')
                    var body = dom.window.document.querySelector('body')
                    resolve(node.innerHTML + "</head>" + body.outerHTML);
                })
            // parse local file
            } else if (input.type == "file") {
                resolve(readFileSync(input.content, 'utf-8'))
            // parse text content
            } else {
                resolve(input.content);
            }
        })
    }

    //create content type, encrypt content, post keys to API and return content type with encryption
    public createContent = async(input: ContentOptions): Promise<Content> => {
        var self = this
        return new Promise(function(resolve, reject) {
            self.convertContent(input).then(text => {
                var content: Content = {
                    id: self.generateID(),
                    name: input.name,
                    description: input.description,
                    price: input.price,
                    key: uid(16),
                    content: text,
                    output: null
                }
                if (input.type != "fullPage") {
                    content.content = self.encrypt(content.content, content.key);
                    content.output = self.generateHTML(content);

                // demo specific content    
                } else {
                    content.output = content.content;
                }
                
                //post keys to API
                self.postKeys(content);

                //add content to array
                self.contents.push(content)

                //return content
                resolve(content)
            })
        });
    };

    // create multiple content types
    public getOutputs = (options: Array<ContentOptions>) => {
        var self = this
        return new Promise(function(resolve) {
            const result = options.map(async(content) => {
                return await self.createContent(content)
            })
            Promise.all(result).then(res => {
                resolve(res)
            })
        })
    }
}
