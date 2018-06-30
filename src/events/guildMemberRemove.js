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
const catchEvent = require("../utilities/catchEvent.js");
const client = require("../services/client.js");
const db = require("../services/database.js");

client.on("guildMemberRemove", catchEvent(async (guild, member) => {
  await db.pool.query(
    "UPDATE users SET in_guild = false WHERE (guild_id, user_id) = ($1, $2)",
    [guild.id, member.id]
  );
}));
