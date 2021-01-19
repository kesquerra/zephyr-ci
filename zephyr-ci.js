var crypto = require("crypto-js");

exports.verify = function(key, clientID) {
    var hmac = crypto.HmacSHA256(key + clientID)

    //TODO: send hmac to API

    //TODO: confirm client
    
}

exports.encryptText = function(text, key) {
    var cipher = crypto.SHA256(text, key).toString();
    return cipher;
}

exports.encryptObject = function(object, key) {
    var cipher = crypto.SHA256(JSON.stringify(object), key).toString();
    return cipher;
}

exports.createContentKey = function(clientID) {
    var token = require('random-token').create(clientID);
    var key = token(16);
    return key;
}

exports.getNewResID = function() {
    var api = "placeholder.com"
    fetch(api, {method: "GET"})
    .then(function (res) {
        return res.json();
    })
}

//TODO: set price for content

exports.sendKey = function(clientID) {
    //TODO: add confirmation of client

    var key = createContentKey(clientID);
    var resID = getNewResID(clientID);
    var payload = {
        "clientID": clientID,
        "resID": resID,
        "key": key
        //TODO: add price to object
    };

    fetch(api, {
        method:"POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
}