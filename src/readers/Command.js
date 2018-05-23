"use strict";
const {TypeReader, TypeReaderResult} = require("patron.js");

module.exports = new class CommandReader extends TypeReader {
  constructor() {
    super({
      type: "command"
    });
  }

  async read(cmd, msg, arg, args, val, me) {
    const match = me.registry.commands.find(c => me.registry.equals(c.name, val));
    if (match === undefined)
      return TypeReaderResult.fromError(cmd, "This command doesn't exist.");
    else
      return TypeReaderResult.fromSuccess(match);
  }
}();
