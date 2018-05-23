"use strict";
const {Argument, Command} = require("patron.js");
const config = require("../../config.js");
const message = require("../../utilities/message.js");

module.exports = new class UnrepCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "PapaJohn#6666",
        key: "a",
        name: "user",
        preconditions: ["noself"],
        type: "user"
      })],
      cooldown: config.unrepCd,
      description: "Remove reputation from any user.",
      groupName: "reputation",
      names: ["unrep"],
      preconditions: ["memberage"]
    });
    this.uses = 0;
  }

  async run(msg, args, me) {
    await me.db.giveRep(msg.channel.guild.id, args.a.id, -me.config.unrepDecrease);
    await message.create(msg.channel, `You have successfully unrepped **${message.tag(args.a)}**.`);
  }
}();
