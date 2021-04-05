import { ClientData, Content, ContentOptions } from './DataTypes';
export declare class Zephyr {
    clientID: string;
    clientKey: string;
    ZephyrUrl: string;
    contents: Content[];
    contentPromise: Promise<void>;
    constructor(options: ClientData);
    private request;
    private buildHmac;
    private postKeys;
    private generateHTML;
    private generateID;
    private encryptText;
    private encryptImage;
    private encryptLocalFile;
    private encrypt;
    private convertContent;
    createContent: (input: ContentOptions) => Promise<Content>;
    getOutputs: (options: Array<ContentOptions>) => Promise<unknown>;
}
