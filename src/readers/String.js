"use strict";
const {TypeReader, TypeReaderResult} = require("patron.js");

module.exports = new class StringReader extends TypeReader {
  constructor() {
    super({
      type: "string"
    });
  }

  async read(cmd, msg, arg, args, val) {
    return TypeReaderResult.fromSuccess(val);
  }
}();
