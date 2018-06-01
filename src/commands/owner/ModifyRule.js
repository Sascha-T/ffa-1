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
const Database = require("../../services/Database.js");
const message = require("../../utilities/message.js");
const ruleService = require("../../services/rules.js");

module.exports = new class AddRuleCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "3b",
        key: "rule",
        name: "rule",
        type: "rule"
      }), new Argument({
        example: "\"Nutting faster than Willy Wonka\"",
        key: "content",
        name: "content",
        type: "string"
      }), new Argument({
        defaultValue: null,
        example: "420h",
        key: "muteLen",
        name: "max mute length",
        type: "timespan"
      })],
      description: "Modifies any rule.",
      groupName: "owner",
      names: ["modifyrule", "editrule", "changerule"]
    });
  }

  async run(msg, args) {
    await Database.pool.query(
      "update rules set content = $1, mute_length = $2 where id = $3 and category = $4 and timestamp = $5",
      [args.content, args.muteLen, msg.channel.guild.id, args.rule.category, args.rule.timestamp]
    );
    await message.reply(msg, "you have successfully modified this rule.");
    await ruleService.update(msg.channel.guild.id);
  }
}();
