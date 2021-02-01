export interface Content {
    id: string;
    name: string;
    description: string;
    price: number;
    cipher: any;
}
export interface ContentOptions {
    name: string;
    description: string;
    url: string;
    price: number;
    key: string;
    type: string;
    content: any;
}
