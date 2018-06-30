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
const patron = require("patron.js");
const {config} = require("../../services/cli.js");
const message = require("../../utilities/message.js");
const {data: {descriptions}} = require("../../services/data.js");
const str = require("../../utilities/string.js");

module.exports = new class Command extends patron.Command {
  constructor() {
    super({
      args: [new patron.Argument({
        example: "rep",
        key: "command",
        name: "name",
        type: "command"
      })],
      description: "Information about a specific command.",
      groupName: "system",
      names: ["command", "cmd", "cmdinfo", "commandinfo"],
      usableContexts: [patron.Context.DM, patron.Context.Guild]
    });
  }

  async run(msg, args) {
    await message.create(msg.channel, {
      description: str.format(
        descriptions.command,
        args.command.description,
        config.bot.prefix,
        args.command.getUsage(),
        args.command.getExample()
      ),
      title: str.capitalize(args.command.names[0])
    });
  }
}();
