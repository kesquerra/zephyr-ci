var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const container = document.getElementById("test");
const showContent = (content) => {
    let output = `
    <div class="zephyr-ci">${content.id}</div>
    <div class="name">${content.name}</div>
    <div class="description">${content.description}</div>
    <div class="price">${content.price}</div>
    <div class="cipher">${content.cipher}</div>`;
    container.innerHTML += output;
};
const getContent = (id, url) => __awaiter(this, void 0, void 0, function* () {
    const data = yield fetch(url);
    const content = yield data.json();
    const contentDetails = {
        id: content.id,
        name: content.name,
        description: content.description,
        price: content.price,
        cipher: content.cipher
    };
});
//# sourceMappingURL=zephyr-client.js.map