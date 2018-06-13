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
const {ArgumentPrecondition, PreconditionResult} = require("patron.js");
const Database = require("../../services/Database.js");

module.exports = new class HigherRepArgumentPrecondition extends ArgumentPrecondition {
  constructor() {
    super({
      name: "higherrep"
    });
  }

  async run(cmd, msg, arg, args, val, opt) {
    const author = await Database.getUser(msg.channel.guild.id, msg.author.id, "reputation");
    const user = await Database.getUser(msg.channel.guild.id, val.id, "reputation");

    if (user.reputation < author.reputation)
      return PreconditionResult.fromSuccess();

    return PreconditionResult.fromError(cmd, "you may not use this command on users with a higher reputation than yourself.");
  }
}();
