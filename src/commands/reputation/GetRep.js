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
const {Argument, ArgumentDefault, Command} = require("patron.js");
const Database = require("../../services/Database.js");
const message = require("../../utilities/message.js");
const str = require("../../utilities/string.js");

module.exports = new class GetRepCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        defaultValue: ArgumentDefault.Author,
        example: "@Nolan#6900",
        key: "user",
        name: "user",
        type: "user"
      })],
      description: "Get anyone's reputation.",
      groupName: "reputation",
      names: ["getrep", "getrank"]
    });
  }

  async run(msg, args) {
    const query = await Database.pool.query(
      "WITH members AS (SELECT * FROM users u WHERE u.guild_id = $1 and u.in_guild = true)," +
      "ranked_users AS (SELECT t.reputation, t.user_id, ROW_NUMBER() OVER(ORDER BY t.reputation DESC) as pos FROM members t)" +
      "SELECT s.pos, s.reputation FROM ranked_users s WHERE s.user_id = $2",
      [msg.channel.guild.id, args.user.id]
    );
    const {pos, reputation} = query.rows[0];
    await message.create(msg.channel, {
      description: `**Reputation:** ${Math.floor(reputation * 100) / 100}\n**Rank:** #${pos}`,
      title: `${message.tag(args.user)}'s Reputation`
    });
  }
}();
