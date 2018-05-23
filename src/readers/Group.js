"use strict";
const {TypeReader, TypeReaderResult} = require("patron.js");

module.exports = new class GroupReader extends TypeReader {
  constructor() {
    super({
      type: "group"
    });
  }

  async read(cmd, msg, arg, args, val, me) {
    const match = me.registry.groups.find(c => me.registry.equals(c.name, val));
    if (match === undefined)
      return TypeReaderResult.fromError(cmd, "This module doesn't exist.");
    else
      return TypeReaderResult.fromSuccess(match);
  }
}();
