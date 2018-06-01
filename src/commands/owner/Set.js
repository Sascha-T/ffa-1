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
const message = require("../../utilities/message.js");

module.exports = new class SetCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "rep",
        key: "table",
        name: "table",
        type: "string"
      }), new Argument({
        example: "increase",
        key: "column",
        name: "column",
        type: "string"
      }), new Argument({
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

  async run(msg, args, me) {
    const column = await me.db.pool.query(
      `select data_type from information_schema.columns where (table_schema, table_name, column_name) = ('public', $1, $2)`,
      [args.table, args.column]
    );

    if (column.rows.length === 0)
      await message.reply(msg, "invalid table and column pair specified.");
    else {
      const type = column.rows[0].data_type;

      if (type === "ARRAY") {
        await message.reply(
          msg,
          `this column is a list, use either \`${me.config.bot.prefix}add\` or \`${me.config.bot.prefix}remove\`.`
        );
      } else if (type.indexOf("int") !== -1 || type === "real") {
        await me.db.pool.query(
          `update ${args.table} set ${args.column} = $1 where id = $2`,
          [Number(args.value), msg.channel.guild.id]
        );
        await message.reply(msg, "column updated.");
      } else if (type === "character varying") {
        await me.db.pool.query(
          `update ${args.table} set ${args.column} = $1 where id = $2`,
          [args.value, msg.channel.guild.id]
        );
        await message.reply(msg, "column updated.");
      } else
        throw new TypeError(`Table ${args.table} Column ${args.column} has an unsupported type.`);
    }
  }
}();
