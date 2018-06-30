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
const {Argument, Command} = require("patron.js");
const db = require("../../services/database.js");
const message = require("../../utilities/message.js");
const ruleService = require("../../services/rules.js");

module.exports = new class RemoveRule extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "2d",
        key: "rule",
        name: "rule",
        type: "rule"
      })],
      description: "Removes a rule.",
      groupName: "owner",
      names: ["removerule", "deleterule", "eraserule"]
    });
  }

  async run(msg, args) {
    const category = args.rule.category.toLowerCase();

    await db.pool.query(
      "DELETE FROM rules WHERE (guild_id, category, epoch) = ($1, $2, $3)",
      [msg.channel.guild.id, category, args.rule.epoch]
    );
    await message.reply(msg, "you have successfully removed this rule.");
    await ruleService.update(msg.channel.guild.id);
  }
}();
