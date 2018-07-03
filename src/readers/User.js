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
const client = require("../services/client.js");
const {data: {regexes}} = require("../services/data.js");

module.exports = new class User extends TypeReader {
  constructor() {
    super({type: "user"});
  }

  async read(cmd, msg, arg, args, val) {
    let id = val.match(regexes.mention);

    if (id != null || (id = val.match(regexes.id)) != null)
      return TypeReaderResult.fromSuccess(client.users.get(id[id.length - 1]));

    if (msg.channel.guild == null)
      return TypeReaderResult.fromError(cmd, "User not found.");

    const index = val.lastIndexOf("#");

    if (index === -1) {
      const member = msg.channel.guild.members
        .find(m => m.username === val || (m.nick != null && m.nick === val));

      if (member != null)
        return TypeReaderResult.fromSuccess(member.user);
    } else {
      const discrim = val.slice(index + 1);
      const username = val.slice(0, index);

      if (regexes.discrim.test(discrim) === true) {
        const member = msg.channel.guild.members
          .find(m => m.discriminator === discrim
            && (m.username === username
            || (m.nick != null && m.nick === username)));

        if (member != null)
          return TypeReaderResult.fromSuccess(member.user);
      }
    }

    return TypeReaderResult.fromError(cmd, "User not found.");
  }
}();
