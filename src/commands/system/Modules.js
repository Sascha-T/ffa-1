"use strict";
const {Command, Context} = require("patron.js");
const message = require("../../utilities/message.js");

module.exports = new class ModulesCommand extends Command {
  constructor() {
    super({
      description: "List of all the command modules.",
      groupName: "system",
      names: ["modules", "categories", "groups", "modulelist", "categorylist", "grouplist"],
      usableContexts: [Context.DM, Context.Guild]
    });
    this.uses = 0;
  }

  async run(msg, args, me) {
    await message.create(msg.channel, {
      description: message.list(me.registry.groups, "name", "description"),
      title: "Modules"
    });
  }
}();
