import { ClientData, Content, ContentOptions } from './DataTypes';
export declare class Zephyr {
    clientID: string;
    clientKey: string;
    ZephyrUrl: string;
    private accessToken?;
    private accessTokenPromise;
    constructor(options: ClientData);
    private request;
    private getToken;
    private postKeys;
    private generateHTML;
    private generateID;
    private encryptText;
    private encryptImage;
    private encrypt;
    createContent: (options: ContentOptions) => Content;
}
