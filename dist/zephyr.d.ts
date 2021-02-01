import { Content } from './Content';
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
    postKeys: (content: Content) => Promise<void>;
}
interface ClientData {
    clientID: string;
    clientKey: string;
}
export {};
