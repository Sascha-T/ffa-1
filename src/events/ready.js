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
const {config} = require("../services/cli.js");
const Database = require("../services/Database.js");
const Logger = require("../utilities/Logger.js");
const path = require("path");
const {RequireAll} = require("patron.js");
const str = require("../utilities/string.js");
const wrapEvent = require("../utilities/wrapEvent.js");

async function reqAbs(dir) {
  return RequireAll(path.join(__dirname, dir));
}

client.on("ready", wrapEvent(async () => {
  await client.editStatus({name: str.format(config.bot.game, config.bot.prefix)});

  for (const guild of client.guilds.values()) {
    const {channels, roles} = await Database.getGuild(guild.id, {
      channels: "archive_id, ignored_ids, log_id, rules_id",
      roles: "muted_id"
    });
    const guildChannels = guild.channels.map(c => c.id);
    const guildRoles = guild.roles.map(r => r.id);
    const exists = channels.ignored_ids.filter(i => guildChannels.indexOf(i) !== -1);

    if (channels.archive_id != null && guildChannels.indexOf(channels.archive_id) === -1)
      await Database.pool.query("UPDATE channels SET archive_id = null WHERE id = $1", [guild.id]);

    if (exists.length !== channels.ignored_ids.length) {
      await Database.pool.query(
        "UPDATE channels SET ignored_ids = $1 WHERE id = $2",
        [guild.id, JSON.stringify(exists)]
      );
    }

    if (channels.log_id != null && guildChannels.indexOf(channels.log_id) === -1)
      await Database.pool.query("UPDATE channels SET log_id = null WHERE id = $1", [guild.id]);

    if (channels.rules_id != null && guildChannels.indexOf(channels.rules_id) === -1)
      await Database.pool.query("UPDATE channels SET rules_id = null WHERE id = $1", [guild.id]);

    if (roles.muted_id != null && guildRoles.indexOf(roles.muted_id) === -1)
      await Database.pool.query("UPDATE roles SET muted_id = null WHERE id = $1", [guild.id]);

    const query = await Database.pool.query("SELECT user_id, in_guild FROM users WHERE guild_id = $1", [guild.id]);
    const users = query.rows;

    for (let i = 0; i < users.length; i++) {
      if (guild.members.has(users[i].user_id) !== users[i].in_guild) {
        await Database.pool.query(
          "UPDATE users SET in_guild = $1 WHERE (guild_id, user_id) = ($2, $3)",
          [guild.members.has(users[i].user_id), guild.id, users[i].user_id]
        );
      }
    }
  }

  await reqAbs("../timers");
  await require("../preconditions/command/MaxActions.js").loop();
  Logger.info("READY");
}));
