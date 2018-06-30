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
const {Argument, ArgumentDefault, Command} = require("patron.js");
const db = require("../../services/database.js");
const message = require("../../utilities/message.js");
const {data: {responses, queries}} = require("../../services/data.js");
const str = require("../../utilities/string.js");

module.exports = new class GetRep extends Command {
  constructor() {
    super({
      args: [new Argument({
        defaultValue: ArgumentDefault.Author,
        example: "@Nolan#6900",
        key: "user",
        name: "user",
        remainder: true,
        type: "user"
      })],
      description: "Get anyone's reputation.",
      groupName: "reputation",
      names: ["getrep", "rank"]
    });
    this.lbQuery = str.format(queries.selectRep, "DESC");
  }

  async run(msg, args) {
    const res = await db.pool.query(this.lbQuery, [msg.channel.guild.id]);
    const len = res.rows.length - 1;
    let pos = res.rows.length;
    let {reputation} = res.rows[len];

    for (let i = 0; i < len; i++) {
      if (res.rows[i].user_id === args.user.id) {
        pos = i + 1;
        ({reputation} = res.rows[i]);
        break;
      }
    }

    await message.create(msg.channel, {
      description: str.format(responses.repRank, reputation.toFixed(2), pos),
      title: `${str.pluralize(message.tag(args.user))} Reputation`
    });
  }
}();
