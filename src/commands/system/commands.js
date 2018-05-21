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
  }

  async run(msg, args, me) {
    const reply = {
      description: message.list(me.registry.commands.map(cmd => {
        return {name: `${me.config.prefix}${cmd.names[0]}`, description: cmd.description};
      }), "name", "description"),
      title: "Commands"
    };

    if(msg.channel.type === 1)
      await message.create(msg.channel, reply);
    else
      await message.dm(msg.author, reply);
  }
}();
