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
