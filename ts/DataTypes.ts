// output content type
export interface Content {
    id: string
    name: string
    description: string
    price: number
    key: string
    content: any
    output: string
}

// client input content type
export interface ContentOptions {
    name: string
    description: string
    price: number
    content: any
    type: any
}

// content type to send to API
export interface ContentAPI {
    id: string
    price: number
    key: string
}

// hmac type for API authentication
export interface HMAC {
    id: string,
    nonce: string,
    time: number,
    signature: string
}

// client input type
export interface ClientData {
        clientID: string;
        clientKey: string;
    }