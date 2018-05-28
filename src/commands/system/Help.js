"use strict";
const {Command, Context} = require("patron.js");
const util = require("util");
const message = require("../../utilities/message.js");

module.exports = new class HelpCommand extends Command {
  constructor() {
    super({
      description: "Information about the bot.",
      groupName: "system",
      names: ["help", "information", "info"],
      usableContexts: [Context.DM, Context.Guild]
    });
    this.helpMsg = false;
    this.uses = 0;
  }

  async run(msg, args, me) {
    if (this.helpMsg === false) {
      this.helpMsg = util.format(
        me.config.guild.helpMsg, me.config.bot.prefix, me.config.bot.prefix, me.config.bot.prefix, me.config.bot.prefix,
        me.config.bot.prefix, me.config.bot.prefix, me.config.bot.prefix, me.config.guild.invite
      );
    }

    const reply = {
      description: this.helpMsg,
      title: "FFA Information"
    };

    if (msg.channel.guild == null)
      await message.create(msg.channel, reply);
    else {
      await message.dm(msg.author, reply);
      await message.reply(msg, "you have been DMed with bot information.");
    }
  }
}();
