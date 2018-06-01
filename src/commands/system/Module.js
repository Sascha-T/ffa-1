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
const {Argument, Command, Context} = require("patron.js");
const {config} = require("../../services/cli.js");
const message = require("../../utilities/message.js");
const string = require("../../utilities/string.js");

module.exports = new class ModuleCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "system",
        key: "a",
        name: "name",
        type: "group"
      })],
      description: "List of all commands in a specific module.",
      groupName: "system",
      names: ["module", "category", "group"],
      usableContexts: [Context.DM, Context.Guild]
    });
    this.uses = 0;
  }

  async run(msg, args) {
    await message.create(msg.channel, {
      description: message.list(args.a.commands.map(cmd => ({
        description: cmd.description,
        name: `${config.bot.prefix}${cmd.names[0]}`
      })), "name", "description"),
      title: `${string.capitalize(args.a.name)}'s Commands`
    });
  }
}();
