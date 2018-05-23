"use strict";
const {Argument, Command} = require("patron.js");
const config = require("../../config.js");
const message = require("../../utilities/message.js");

module.exports = new class RepCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "AlabamaTrigger#0001",
        key: "a",
        name: "user",
        preconditions: ["noself"],
        type: "user"
      })],
      cooldown: config.repCd,
      description: "Give reputation to any user.",
      groupName: "reputation",
      names: ["rep"],
      preconditions: ["memberage"]
    });
    this.uses = 0;
  }

  async run(msg, args, me) {
    await me.db.giveRep(msg.channel.guild.id, args.a.id, me.config.repIncrease);
    await message.create(msg.channel, `You have successfully repped **${message.tag(args.a)}**.`);
  }
}();
