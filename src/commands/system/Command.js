"use strict";
const {Argument, Command, Context} = require("patron.js");
const message = require("../../utilities/message.js");
const str = require("../../utilities/string.js");

module.exports = new class CommandCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "rep",
        key: "a",
        name: "name",
        type: "command"
      })],
      description: "Information about a specific command.",
      groupName: "system",
      names: ["command", "cmd", "cmdinfo", "commandinfo"],
      usableContexts: [Context.DM, Context.Guild]
    });
    this.uses = 0;
  }

  async run(msg, args, me) {
    await message.create(msg.channel, {
      description: `**Description:** ${args.a.description}\n**Usage:** \`${me.config.bot.prefix}${args.a.getUsage()}\`\n**Example:** \`${me.config.bot.prefix}${args.a.getExample()}\``,
      title: str.uppercase(args.a.names[0])
    });
  }
}();
