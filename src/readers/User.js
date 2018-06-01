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
const {TypeReader, TypeReaderResult} = require("patron.js");
const regexes = require("../utilities/regexes.js"); // TODO fix username matching

module.exports = new class UserReader extends TypeReader {
  constructor() {
    super({
      type: "user"
    });
  }

  async read(cmd, msg, arg, args, val, me) {
    let id = val.match(regexes.mention);

    if (id != null || (id = val.match(regexes.id)) != null) {
      id = id[id.length - 1];

      if (me.client.users.get(id) != null)
        return TypeReaderResult.fromSuccess(me.client.users.get(id));
    }

    if (msg.channel.guild != null) {
      const index = val.lastIndexOf("#");

      if (index === -1) {

      } else {
        let discrim = val.slice(index);
        const username = val.slice(0, index);

        if (regexes.discrim.test(discrim) === true) {
          discrim = Number(discrim);
          const member = msg.channel.guild.members.find(m => m.discriminator === discrim && m.username === username);

          if (member != null)
            return TypeReaderResult.fromSuccess(member.user);
        }
      }
    }

    return TypeReaderResult.fromError(cmd, "User not found.");
  }
}();
