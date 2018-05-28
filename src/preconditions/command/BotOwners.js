"use strict";
const {Precondition, PreconditionResult} = require("patron.js");

module.exports = new class BotOwnersPrecondition extends Precondition {
  constructor() {
    super({
      name: "botowners"
    });
  }

  async run(cmd, msg, options, me) {
    if (me.auth.bot.owners.indexOf(msg.author.id) === -1)
      return PreconditionResult.fromError(cmd, "This command may only be used by the bot owners.");

    return PreconditionResult.fromSuccess();
  }
}();
