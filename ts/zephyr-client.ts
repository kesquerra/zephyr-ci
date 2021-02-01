import {Content} from './Content';
import {uid} from 'rand-token';
import {AES} from 'crypto-ts';

export class ContentCreator {
    public content: Content;
    public output: string;
    

    constructor (content: Content) {
        this.content = content;
        this.generateID();
        this.encryptText(content.cipher)
        this.output = this.showContent()
        
    }

    showContent = (): string => {
        let output: string = `
        <div class="zephyr-content" data-content-id="${this.content.id}">
            <div class="zephyr-name">Name: ${this.content.name}</div>
            <div class="zephyr-description">Description: ${this.content.description}</div>
            <div class="zephyr-price">Price: ${this.content.price}</div>
            <div class="zephyr-cipher">Content: ${this.content.cipher}</div>
        </div>`
        return output;
    }

    generateID = (): void => {
        var id = uid(16);
        this.content.id = id;
    }

    encryptText = (text: string): void => {
        var key = uid(32);
        var cipher = AES.encrypt(text, key)
        this.content.cipher = cipher;

        console.log(key); //for testing purposes only
    }



    getContent = async(id: string, url: string): Promise<void> => {
        const data: Response = await fetch(url)
        const content: any = await data.json()
        const contentDetails = {
            id: content.id,
            name: content.name,
            description: content.description,
            price: content.price,
            cipher: content.cipher
        }

        this.showContent()

    }
}