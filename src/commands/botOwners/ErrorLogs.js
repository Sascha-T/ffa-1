"use strict";
const fs = require("fs");
const {Command, Context} = require("patron.js");
const util = require("util");
const Logger = require("../../utilities/Logger.js");
const message = require("../../utilities/message.js");
const readFile = util.promisify(fs.readFile);

module.exports = new class ErrorLogsCommand extends Command {
  constructor() {
    super({
      description: "Sends the error logs as an attached file.",
      groupName: "botowners",
      names: ["errorlogs", "errorlog"],
      usableContexts: [Context.DM, Context.Guild]
    });
    this.uses = 0;
  }

  async run(msg) {
    const name = `${Logger.dateStr}-Errors`;
    let file;

    try {
      file = await readFile(`${Logger.logsPath}/${name}`);
    } catch (e) {
      if (e.code === "ENOENT")
        return message.create(msg.channel, "No error log file has been created.", "error");
      else
        throw e;
    }

    await msg.channel.createMessage("", {
      file,
      name
    });
  }
}();
