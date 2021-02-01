import { Content, ContentOptions } from './Content';
export declare class Zephyr {
    clientID: string;
    clientKey: string;
    ZephyrUrl: string;
    private accessToken?;
    private accessTokenPromise;
    constructor(options: ClientData);
    private request;
    private getToken;
    private encryptText;
    createContent(data: Partial<ContentOptions>): Promise<Content>;
}
interface ClientData {
    clientID: string;
    clientKey: string;
}
export {};
