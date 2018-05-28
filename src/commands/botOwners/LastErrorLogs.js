"use strict";
const fs = require("fs");
const {Argument, Command, Context} = require("patron.js");
const util = require("util");
const Logger = require("../../utilities/Logger.js");
const message = require("../../utilities/message.js");
const string = require("../../utilities/string.js");
const readFile = util.promisify(fs.readFile);

module.exports = new class LastErrorLogsCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        defaultValue: 20,
        example: "15",
        key: "a",
        name: "lineCount",
        type: "integer"
      })],
      description: "Sends the most recent error logs.",
      groupName: "botowners",
      names: ["lasterrorlogs", "lasterror"],
      usableContexts: [Context.DM, Context.Guild]
    });
    this.uses = 0;
  }

  async run(msg, args) {
    const name = `${Logger.dateStr}-Errors`;
    let file;
    let reply = "";

    try {
      file = (await readFile(`${Logger.logsPath}/${name}`, "utf8")).split("\n");
    } catch (e) {
      if (e.code === "ENOENT")
        return message.create(msg.channel, "No error log file has been created.", "error");
      else
        throw e;
    }

    for (let a = args.a >= file.length ? 0 : file.length - args.a; a < file.length; a++)
      reply += `${file[a]}\n`;

    await message.create(msg.channel, string.code(reply));
  }
}();
