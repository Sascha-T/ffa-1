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
const Logger = require("../utilities/Logger.js");
const str = require("../utilities/string.js");

module.exports = me => {
  me.client.on("ready", async () => {
    try {
      await me.client.editStatus({name: str.format(me.config.bot.game, me.config.bot.prefix)});

      for (const guild of me.client.guilds.values()) {
        const {channels} = await me.db.getGuild(guild.id, {channels: "archive_id, ignored_ids, log_id, rules_id"});
        const guildChannels = guild.channels.map(c => c.id);
        const exists = channels.ignored_ids.filter(i => guildChannels.indexOf(i) !== -1);

        if (channels.archive_id != null && guildChannels.indexOf(channels.archive_id) === -1)
          await me.db.pool.query("update channels set archive_id = null where id = $1", [guild.id]);

        if (exists.length !== channels.ignored_ids.length) {
          await me.db.pool.query(
            "update channels set ignored_ids = $1 where id = $2",
            [guild.id, JSON.stringify(exists)]
          );
        }

        if (channels.log_id != null && guildChannels.indexOf(channels.log_id) === -1)
          await me.db.pool.query("update channels set log_id = null where id = $1", [guild.id]);

        if (channels.rules_id != null && guildChannels.indexOf(channels.rules_id) === -1)
          await me.db.pool.query("update channels set rules_id = null where id = $1", [guild.id]);
      }
      Logger.info("READY");
    } catch (e) {
      Logger.error(e);
    }
  });
};
