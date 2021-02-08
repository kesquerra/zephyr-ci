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
}
export interface ContentAPI {
    id: string;
    price: number;
    key: string;
}
export interface ClientData {
    clientID: string;
    clientKey: string;
}
export interface AccessTokenData {
    value: string;
    expiration: number;
}
