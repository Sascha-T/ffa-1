"use strict";
const {TypeReader, TypeReaderResult} = require("patron.js");

module.exports = new class GroupReader extends TypeReader {
  constructor() {
    super({
      type: "group"
    });
  }
  read(cmd, msg, arg, args, val, me) {
    const match = me.registry.groups.find(c => me.registry.equals(c.name, val));
    if(match != null)
      return Promise.resolve(TypeReaderResult.fromSuccess(match));
    else
      return Promise.resolve(TypeReaderResult.fromError(cmd, "This module doesn't exist."));
  }
}();
