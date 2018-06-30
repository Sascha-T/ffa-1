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
const {Argument, Command} = require("patron.js");
const {config} = require("../../services/cli.js");
const db = require("../../services/database.js");
const message = require("../../utilities/message.js");
const {data: {responses, queries}} = require("../../services/data.js");
const str = require("../../utilities/string.js");

/**
 * TODO delete this command, the query sql file, and the responses entries,
 * when web dashboard is finished.
 */
module.exports = new class Set extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "rep",
        key: "table",
        name: "table",
        type: "string"
      }),
      new Argument({
        example: "increase",
        key: "column",
        name: "column",
        type: "string"
      }),
      new Argument({
        example: "5",
        key: "value",
        name: "value",
        type: "string"
      })],
      description: "Sets a server option.",
      groupName: "owner",
      names: ["set", "config"]
    });
  }

  async run(msg, args) {
    const column = await db.pool.query(
      queries.columnType,
      [args.table, args.column]
    );

    if (column.rows.length === 0) {
      await message.replyError(msg, "invalid table and column pair specified.");
    } else {
      const type = column.rows[0].data_type;

      if (type === "ARRAY") {
        await message.replyError(
          msg,
          str.format(responses.setList, config.bot.prefix)
        );
      } else if (type.includes("int") === true || type === "real") {
        await db.pool.query(
          `UPDATE ${args.table} SET ${args.column} = $1 WHERE id = $2`,
          [Number(args.value), msg.channel.guild.id]
        );
        await message.reply(msg, "column updated.");
      } else if (type === "character varying") {
        await db.pool.query(
          `UPDATE ${args.table} SET ${args.column} = $1 WHERE id = $2`,
          [args.value, msg.channel.guild.id]
        );
        await message.reply(msg, "column updated.");
      } else {
        throw new TypeError(str.format(
          responses.setErr,
          args.table,
          args.column
        ));
      }
    }
  }
}();
