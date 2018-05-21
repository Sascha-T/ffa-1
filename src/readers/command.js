"use strict";
const {TypeReader, TypeReaderResult} = require("patron.js");

module.exports = new class CommandReader extends TypeReader {
  constructor() {
    super({
      type: "command"
    });
  }
  read(cmd, msg, arg, args, val, me) {
    const match = me.registry.commands.find(c => me.registry.equals(c.name, val));
    if(match != null)
      return Promise.resolve(TypeReaderResult.fromSuccess(match));
    else
      return Promise.resolve(TypeReaderResult.fromError(cmd, "This command doesn't exist."));
  }
}();
