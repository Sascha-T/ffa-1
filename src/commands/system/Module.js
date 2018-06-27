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
const registry = require("../../services/registry.js");
const {data: {descriptions, responses}} = require("../../services/data.js");
const str = require("../../utilities/string.js");

module.exports = new class Module extends Command {
  constructor() {
    super({
      args: [new Argument({
        defaultValue: false,
        example: "system",
        key: "group",
        name: "name",
        type: "group"
      })],
      description: descriptions.module,
      groupName: "system",
      names: ["module",
        "modules",
        "category",
        "categories",
        "group",
        "groups",
        "modulelist",
        "categorylist",
        "grouplist"],
      usableContexts: [Context.DM, Context.Guild]
    });
    this.uses = 0;
  }

  async run(msg, args) {
    if (args.group === false) {
      await message.create(msg.channel, {
        description: registry.groups.map(group => str.format(
          responses.itemList,
          `${str.capitalize(group.name)}:`,
          group.description
        )).join("\n"),
        title: "Modules"
      });
    } else {
      await message.create(msg.channel, {
        description: args.group.commands.map(cmd => str.format(
          responses.itemList,
          `${config.bot.prefix}${cmd.names[0]}`,
          cmd.description
        )).join("\n"),
        title: `${str.pluralize(str.capitalize(args.group.name))} Commands`
      });
    }
  }
}();
