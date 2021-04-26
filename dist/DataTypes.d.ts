export interface Content {
    id: string;
    name: string;
    description: string;
    price: number;
    key: string;
    content: any;
    output: string;
}
export interface ContentOptions {
    name: string;
    description: string;
    price: number;
    content: any;
    type: any;
}
export interface ContentAPI {
    id: string;
    price: number;
    key: string;
}
export interface HMAC {
    id: string;
    nonce: string;
    time: number;
    signature: string;
}
export interface ClientData {
    clientID: string;
    clientKey: string;
}
