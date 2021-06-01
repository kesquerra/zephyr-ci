# Zephyr Content Integration
***
This component is part of the [Zephyr Payment Platform](https://gitlab.com/zephyr-payments)

The Zephyr Payment Platform aims to replace the current subscription based content model with a pay-per-view model.

This content integration component can be installed on any NPM applicable server.

Utilizing this package allows for input content and encryption of said content to display on the web application while sending all necessary information to the Zephyr API, in concert with the web extension for clients to purchase and decrypt content generated by this component.

## [NPM Package](https://www.npmjs.com/package/zephyr-ci)

### Installation
`npm install zephyr-ci`

### Implementation Server-Side
Client Configuration
```javascript
const zephyr = require('zephyr-ci');

const config = {
    clientID: [client email],
    clientKey: [client key]
};

const connection = new zephyr.Zephyr(config);
```

Local File Example
```javascript
const file = {
    name: "[Article Name]",
    description: "[Description of Article]",
    price: [price_of_content],
    content: "[file location]",
    type: "file"
};
```

Text Example
```javascript
const text = {
    name: "[Article Name]",
    description: "[Description of Article]",
    price: [price_of_content],
    content: "[text]",
    type: "text"
};
```

URL Example
```javascript
const article = {
    name: "[Article Name]",
    description: "[Description of Article]",
    price: [price_of_content],
    content: "[url link]",
    type: "url"
};
```

Asynchronous Content Fetching
```javascript
const content_list = [file, text, article];

const content_complete = connection.getOutputs(content_list);
```

Input Content on Webpage

`content_complete` contains the HTML for each piece of content to display on website.

This can be utilized to place content on website however the developer deems appropriate.
