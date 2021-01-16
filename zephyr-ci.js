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

    //TODO: create object to send to API w/ resID, contentID, key

    return key;
}