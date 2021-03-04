var zephyr = require("./ts/zephyr.ts");

var connectionConfig = {
    clientID: "1",
    clientKey: "1"
};

var connection = new zephyr.Zephyr(connectionConfig);

var get_content = function() {
    return new Promise(function(resolve, reject) {
        const content = {name: "Test Content", description: "Content for testing", price: 0.5, content: "https://www.nytimes.com/2021/02/23/technology/ai-innovation-privacy-seniors-education.html", type: "fromURL"};
        const content2 = {name: "Wood Products", description: "Wooden Stuff", price: 1.2, content: "./static/content/sample_section.html", type: "html"};
        var list = [content, content2];
        var contents = connection.getOutputs(list)
        contents.then(res => {
            resolve(res)
        });
    });
};

console.log(connection.get_content())