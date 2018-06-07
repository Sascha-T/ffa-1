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
const client = require("../../services/client.js");
const {config} = require("../../services/cli.js");
const Database = require("../../services/Database.js");
const message = require("../../utilities/message.js");

module.exports = new class RepLeaderboardCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        defaultValue: config.default.lb,
        example: "15",
        key: "count",
        name: "count",
        preconditionOptions: [{max: config.max.lb, min: config.min.lb}],
        preconditions: ["between"],
        type: "integer"
      })],
      description: "The most reputable users.",
      groupName: "reputation",
      names: ["repleaderboard", "replb", "top", "toprep"]
    });
  }

  async run(msg, args) {
    const query = await Database.pool.query(
      "SELECT user_id, reputation FROM users WHERE (guild_id, in_guild) = ($1, true) ORDER BY reputation DESC LIMIT $2",
      [msg.channel.guild.id, args.count]
    );

    await message.create(msg.channel, {
      description: query.rows.map((r, i) => {
        return `${i + 1}. **${message.tag(client.users.get(r.user_id))}**: ${r.reputation.toFixed(2)}`;
      }).join("\n"),
      title: "The Most Reputable Users"
    });
  }
}();
