import { Content } from './DataTypes';
export declare class ContentCreator {
    content: Content;
    output: string;
    constructor(content: Content);
    showContent: () => string;
    generateID: () => void;
    encryptText: (text: string) => void;
    encryptImage: (filePath: string) => void;
    getContent: (id: string, url: string) => Promise<void>;
}
