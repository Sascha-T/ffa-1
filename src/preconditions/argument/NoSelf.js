"use strict";
const {ArgumentPrecondition, PreconditionResult} = require("patron.js");

module.exports = new class Between extends ArgumentPrecondition {
  constructor() {
    super({
      name: "noself"
    });
  }

  async run(command, msg, arg) {
    if (arg.constructor.name !== "User" || msg.author.id !== arg.user.id)
      return PreconditionResult.fromSuccess();
    return PreconditionResult.fromError(command, "This command may not be used on yourself.");
  }
}();
