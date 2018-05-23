"use strict";
const {TypeReader, TypeReaderResult} = require("patron.js");

module.exports = new class IntTypeReader extends TypeReader {
  constructor() {
    super({
      type: "integer"
    });
  }

  async read(command, message, argument, args, input) {
    const result = Number(input);

    if (Number.isInteger(result) === true)
      return TypeReaderResult.fromSuccess(result);
    return TypeReaderResult.fromError(command, "You have provided an invalid integer.");
  }
}();
