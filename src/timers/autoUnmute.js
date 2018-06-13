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
const {config} = require("../services/cli.js");
const Database = require("../services/Database.js");
const modService = require("../services/moderation.js");

const wait = config.timer.autoUnmute * 1e3;
async function loop() {
  const query = await Database.pool.query(
    "SELECT * FROM logs WHERE timestamp > $1 AND type < 4",
    [Math.floor(Date.now() / 1e3) - config.max.mute]
  );

  for (let i = 0; i < query.rows.length; i++) {
    const row = query.rows[i];

    if (row.type === 0 || row.type === 2) {
      const unmute = query.rows.find(r => {
        return r.guild_id === row.guild_id && r.user_id === row.user_id && (r.type === 1 || r.type === 3) &&
          r.timestamp > row.timestamp;
      });

      if (unmute != null)
        continue;

      if (row.timestamp < Math.floor(Date.now() / 1e3) - row.data.length)
        await modService.autoUnmute(row);
    }
  }

  setTimeout(() => loop(), wait);
}

loop();
