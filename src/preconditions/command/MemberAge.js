"use strict";
const {Precondition, PreconditionResult} = require("patron.js");

module.exports = new class MemberAgePrecondition extends Precondition {
  constructor() {
    super({
      name: "memberage"
    });
  }

  async run(cmd, msg, options, me) {
    if (msg.member.joinedAt == null || msg.member.joinedAt + me.config.memberAge < Date.now())
      return PreconditionResult.fromError(cmd, `This command may only be used by members who have been in this guild for at least ${Math.floor(me.config.memberAge / 864e5 * 10) / 10} days.`);
    return PreconditionResult.fromSuccess();
  }
}();
