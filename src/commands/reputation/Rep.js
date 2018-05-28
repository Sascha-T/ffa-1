"use strict";
const {Argument, Command} = require("patron.js");
const message = require("../../utilities/message.js");
const str = require("../../utilities/string.js");

module.exports = me => new class RepCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "AlabamaTrigger#0001",
        key: "a",
        name: "user",
        preconditions: ["noself"],
        type: "user"
      })],
      cooldown: Number(me.config.cd.rep),
      description: "Give reputation to any user.",
      groupName: "reputation",
      names: ["rep"],
      preconditions: ["memberage"]
    });
    this.uses = 0;
  }

  async run(msg, args, me) {
    const {rep: {increase}} = await me.db.getGuild(msg.channel.guild.id, {rep: "increase"});

    await me.db.changeRep(msg.channel.guild.id, args.a.id, increase);
    await message.reply(msg, `you have successfully repped ${str.bold(message.tag(args.a))}.`);
  }
}();
