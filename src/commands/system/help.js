"use strict";
const {Command, Context} = require("patron.js");
const message = require("../../utilities/message.js");

module.exports = new class HelpCommand extends Command {
  constructor() {
    super({
      description: "Information about the bot.",
      groupName: "system",
      names: ["help", "information", "info"],
      usableContexts: [Context.DM, Context.Guild]
    });
  }

  async run(msg, args, me) {
    const reply = {
      description: me.config.helpMsg,
      title: "FFA Information"
    };

    if(msg.channel.type === 1)
      await message.create(msg.channel, reply);
    else
      await message.dm(msg.author, reply);
  }
}();
