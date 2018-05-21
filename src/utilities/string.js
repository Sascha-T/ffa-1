"use strict";
const {uppercase} = require("./regexes.js");

module.exports = {
  capitalize(str) {
    return str.replace(uppercase, x => String.fromCharCode(x.charCodeAt(0) ^ 32));
  }
};
