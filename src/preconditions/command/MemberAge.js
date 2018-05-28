"use strict";
const {Precondition, PreconditionResult} = require("patron.js");

module.exports = new class MemberAgePrecondition extends Precondition {
  constructor() {
    super({
      name: "memberage"
    });
  }

  async run(cmd, msg, options, me) {
    const {ages: {member: memberAge}} = await me.db.getGuild(msg.channel.guild.id, {ages: "member"});

    if (msg.member.joinedAt == null || msg.member.joinedAt + memberAge > Date.now())
      return PreconditionResult.fromError(cmd, `This command may only be used by members who have been in this guild for at least ${Math.floor(memberAge / 8640) / 10} days.`);

    return PreconditionResult.fromSuccess();
  }
}();
