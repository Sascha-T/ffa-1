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
const client = require("../services/client.js");
const Database = require("../services/Database.js");
const wrapEvent = require("../utilities/wrapEvent.js");

client.on("guildMemberRemove", wrapEvent(async (guild, member) => {
  await Database.pool.query(
    "UPDATE users SET in_guild = false WHERE (guild_id, user_id) = ($1, $2)",
    [guild.id, member.id]
  );
}));
