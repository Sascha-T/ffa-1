"use strict";
const {formatting, uppercase} = require("./regexes.js");

module.exports = {
  bold(str) {
    return `**${str}**`;
  },

  capitalize(str) {
    return str.replace(uppercase, x => String.fromCharCode(x.charCodeAt(0) ^ 32));
  },

  code(str, lang = "js") {
    return `\`\`\`${lang}\n${str}\`\`\``;
  },

  escapeFormat(str) {
    return str.replace(formatting, "\\$&");
  }
};
