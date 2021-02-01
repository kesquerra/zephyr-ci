import { Content } from './Content';
export declare class ContentCreator {
    content: Content;
    output: string;
    constructor(content: Content);
    showContent: () => string;
    generateID: () => void;
    encryptText: (text: string) => void;
    getContent: (id: string, url: string) => Promise<void>;
}
