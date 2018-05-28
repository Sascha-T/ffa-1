"use strict";
const {Argument, Command} = require("patron.js");
const message = require("../../utilities/message.js");
const str = require("../../utilities/string.js");

module.exports = me => new class UnrepCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "PapaJohn#6666",
        key: "a",
        name: "user",
        preconditions: ["noself"],
        type: "user"
      })],
      cooldown: Number(me.config.cd.unrep),
      description: "Remove reputation from any user.",
      groupName: "reputation",
      names: ["unrep"],
      preconditions: ["memberage"]
    });
    this.uses = 0;
  }

  async run(msg, args, me) {
    const {rep: {decrease}} = await me.db.getGuild(msg.channel.guild.id, {rep: "decrease"});

    await me.db.changeRep(msg.channel.guild.id, args.a.id, -decrease);
    await message.reply(msg, `you have successfully unrepped ${str.bold(message.tag(args.a))}.`);
  }
}();
