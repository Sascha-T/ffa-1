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
const {Precondition, PreconditionResult} = require("patron.js");
const Database = require("../../services/Database.js");

module.exports = new class TopPrecondition extends Precondition {
  constructor() {
    super({
      name: "top"
    });
  }

  async run(cmd, msg, opt) {
    let query = await Database.getGuild(msg.channel.guild.id, {top: opt.column});
    const count = query.rows[0][opt.column];
    query = await Database.pool.query(
      "SELECT user_id FROM users WHERE (guild_id, in_guild) = ($1, true) ORDER BY reputation DESC LIMIT $2",
      [msg.channel.guild.id, count]
    );
    let result = query.rows.some(r => r.user_id === msg.author.id);

    if (result === true)
      return PreconditionResult.fromSuccess();

    return PreconditionResult.fromError(cmd, `this command may only be used by the top ${count} most reputable users.`);
  }
}();
