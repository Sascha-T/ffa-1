/**
 * FFA - The core control of the free-for-all discord server.
 * Copyright (c) 2018 FFA contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";
const Logger = require("../utilities/Logger.js");
const str = require("../utilities/string.js");

module.exports = me => {
  me.client.on("ready", async () => {
    try {
      await me.client.editStatus({name: str.format(me.config.bot.game, me.config.bot.prefix)});
      Logger.info("READY");
    } catch (e) {
      Logger.error(e);
    }
  });
};
