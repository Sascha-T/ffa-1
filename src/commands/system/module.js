"use strict";
const {Argument, Command, Context} = require("patron.js");
const message = require("../../utilities/message.js");
const string = require("../../utilities/string.js");

module.exports = new class ModuleCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "system",
        key: "a",
        name: "name",
        remainder: true,
        type: "group"
      })],
      description: "List of all commands in a specific module.",
      groupName: "system",
      names: ["module", "category", "group"],
      usableContexts: [Context.DM, Context.Guild]
    });
  }

  async run(msg, args, me) {
    await message.create(msg.channel, {
      description: message.list(args.a.commands.map(cmd => {
        return {name: `${me.config.prefix}${cmd.names[0]}`, description: cmd.description};
      }), "name", "description"),
      title: `${string.capitalize(args.a.name)}'s Commands`
    });
  }
}();
