"use strict";
const {Command, Context} = require("patron.js");
const message = require("../../utilities/message.js");

module.exports = new class RebootCommand extends Command {
  constructor() {
    super({
      description: "Reboots the bot.",
      groupName: "botowners",
      names: ["reboot", "restart"],
      usableContexts: [Context.DM, Context.Guild]
    });
    this.uses = 0;
  }

  async run(msg) {
    await message.create(msg.channel, "Rebooting...", true);
    process.exit(0);
  }
}();
