/**
 * FFA - The core control of the free-for-all discord server.
 * Copyright (c) 2018 FFA contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
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
  }

  async run(msg) {
    const name = `${Logger.dateStr}-Errors`;
    let file;

    try {
      file = await readFile(`${Logger.logsPath}/${name}`);
    } catch (e) {
      if (e.code === "ENOENT")
        return message.replyError(msg.channel, "No error log file has been created.");
      else
        throw e;
    }

    await msg.channel.createMessage("", {
      file,
      name
    });
  }
}();
