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
const {Pool} = require("pg");

module.exports = class PGDatabase {
  constructor(options) {
    this.baseGuildId = options.baseGuildId;
    this.pool = new Pool(options.connection);
  }

  async getGuild(id, columns) {
    const res = {};

    for (const column in columns) {
      if (columns.hasOwnProperty(column) === false)
        continue;

      res[column] = (await this.pool.query(`select ${columns[column]} from ${column} where id = $1`, [id])).rows[0];

      if (res[column] == null && typeof id === "string") {
        const needed = (await this.pool.query(
          "select column_name, is_nullable, column_default from information_schema.columns where (table_schema, table_name) = ('public', $1)",
          [column]
        )).rows.reduce((a, b) => {
          if (b.is_nullable === "NO" && b.column_default == null && b.column_name !== "id")
            a.push(b.column_name);

          return a;
        }, []);

        if (needed.length === 0) {
          res[column] = (await this.pool.query(
            `insert into ${column}(id) values($1) returning ${columns[column]}`,
            [id]
          )).rows[0];
        } else {
          const base = await this.pool.query(`select ${needed.join(", ")} from ${column} where id = $1`, [this.baseGuildId]);
          /* eslint-disable-next-line no-magic-numbers */
          const len = needed.length + 2;
          let values = "$2";

          for (let a = 3; a < len; a++)
            values += `, $${a}`;

          res[column] = (await this.pool.query(
            `insert into ${column}(id, ${needed.join(", ")}) values($1, ${values}) on conflict (id) do nothing returning ${columns[column]}`,
            [id, ...Object.keys(base.rows[0]).map(r => ({key: r, value: base.rows[0][r]}))
              .sort((a, b) => needed.indexOf(a.key) - needed.indexOf(b.key))
              .map(r => r.value)]
          )).rows[0];
        }
      }
    }

    return res;
  }

  async getUser(guildId, userId, columns = "*") {
    return this.pool.query(
      `insert into users(guild_id, user_id) values($1, $2) on conflict (guild_id, user_id) do nothing returning ${columns}`,
      [guildId, userId]
    );
  }

  async changeRep(guildId, userId, change) {
    return this.pool.query(
      "insert into users(guild_id, user_id, reputation) values($1, $2, $3) on conflict (guild_id, user_id) do update set reputation = users.reputation + $3 where (users.guild_id, users.user_id) = ($1, $2)",
      [guildId, userId, change]
    );
  }
};
