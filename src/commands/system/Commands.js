"use strict";
const {Command, Context} = require("patron.js");
const message = require("../../utilities/message.js");

module.exports = new class CommandsCommand extends Command {
  constructor() {
    super({
      description: "List of all the commands.",
      groupName: "system",
      names: ["commands", "cmds", "cmdlist", "commandlist"],
      usableContexts: [Context.DM, Context.Guild]
    });
    this.uses = 0;
  }

  async run(msg, args, me) {
    const reply = {
      description: message.list(me.registry.commands.map(cmd => ({
        description: cmd.description,
        name: `${me.config.prefix}${cmd.names[0]}`
      })), "name", "description"),
      title: "Commands"
    };

    if (msg.channel.guild == null)
      await message.create(msg.channel, reply);
    else {
      await message.dm(msg.author, reply);
      await message.create(msg.channel, "You have been DMed with a list of all commands.");
    }
  }
}();
