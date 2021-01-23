const container: HTMLElement | any = document.getElementById("test")

interface Content {
    id: string
    name: string
    description: string
    price: number
    cipher: any
}

const showContent = (content: Content): void => {
    let output: string = `
    <div class="zephyr-ci">${content.id}</div>
    <div class="name">${content.name}</div>
    <div class="description">${content.description}</div>
    <div class="price">${content.price}</div>
    <div class="cipher">${content.cipher}</div>`
    container.innerHTML += output
}

const getContent = async(id: string, url: string): Promise<void> => {
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