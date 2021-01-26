const container: HTMLElement | any = document.getElementById("test")

export interface Content {
    id: string
    name: string
    description: string
    price: number
    cipher: any
}

export const showContent = (content: Content): void => {
    let output: string = `
    <div class="zephyr-id">${content.id}</div>
    <div class="zephyr-name">${content.name}</div>
    <div class="zephyr-description">${content.description}</div>
    <div class="zephyr-price">${content.price}</div>
    <div class="zephyr-cipher">${content.cipher}</div>`
    container.innerHTML += output
}

export const getContent = async(id: string, url: string): Promise<void> => {
    const data: Response = await fetch(url)
    const content: any = await data.json()
    const contentDetails = {
        id: content.id,
        name: content.name,
        description: content.description,
        price: content.price,
        cipher: content.cipher
    }

    showContent(contentDetails)

}