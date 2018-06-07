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

client.on("channelDelete", wrapEvent(async channel => {
  if (channel.guild != null) {
    const {channels} = await Database.getGuild(channel.guild.id, {channels: "archive_id, ignored_ids, log_id, rules_id"});
    const pos = channels.ignored_ids.indexOf(channel.id);

    if (channel.id === channels.archive_id)
      await Database.pool.query("UPDATE channels SET archive_id = null WHERE id = $1", [channel.guild.id]);
    else if (pos !== -1) {
      channels.ignored_ids.splice(pos, 1);
      await Database.pool.query(
        "UPDATE channels SET ignored_ids = $1 WHERE id = $2",
        [channel.guild.id, JSON.stringify(channels.ignored_ids)]
      );
    } else if (channel.id === channels.log_id)
      await Database.pool.query("UPDATE channels SET log_id = null WHERE id = $1", [channel.guild.id]);
    else if (channel.id === channels.rules_id)
      await Database.pool.query("UPDATE channels SET rules_id = null WHERE id = $1", [channel.guild.id]);
  }
}));
