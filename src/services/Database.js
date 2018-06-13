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
const {Pool} = require("pg").native;
const {auth, config} = require("./cli.js");

module.exports = new class Database {
  constructor(options) {
    this.baseGuildId = config.guild.id;
    this.pool = new Pool(auth.pg);
  }

  async changeRep(guildId, userId, change) {
    return this.pool.query(
      "INSERT INTO users(guild_id, user_id, reputation) VALUES($1, $2, $3) ON CONFLICT (guild_id, user_id) DO UPDATE SET reputation = users.reputation + $3 WHERE (users.guild_id, users.user_id) = ($1, $2)",
      [guildId, userId, change]
    );
  }

  async findNeededColumns(table) {
    const query = await this.pool.query(`SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE (table_schema, table_name) = ('public', '${table}')`);
    // The only columns that need defaults are the not null ones
    // with no PostgreSQL default value, the id column being exempt from that as a primary key.
    const needed = query.rows.filter(c => c.is_nullable === "NO" && c.column_default == null && c.column_name !== "id");

    return needed.map(c => c.column_name);
  }

  async getFirstRow(...args) {
    const query = await this.pool.query(...args);

    return query.rows[0];
  }

  async getGuild(id, tables) {
    const res = {};

    for (const table in tables) {
      if (tables.hasOwnProperty(table) === false)
        continue;

      res[table] = await this.getFirstRow(`SELECT ${tables[table]} FROM ${table} WHERE id = $1`, [id]);

      if (res[table] == null && typeof id === "string") {
        const needed = await this.findNeededColumns(table);

        if (needed.length === 0)
          res[table] = await this.upsert(table, "id", [id], tables[table]);
        else {
          const neededStr = needed.join(", ");
          const defaultValues = await this.getFirstRow(
            `SELECT ${neededStr} FROM ${table} WHERE id = $1`,
            [this.baseGuildId]
          );
          res[table] = await this.upsert(
            table, `id, ${neededStr}`,
            [id, ...this.sortDefaultValues(defaultValues, needed)], tables[table]
          );
        }
      }
    }

    return res;
  }

  async getUser(guildId, userId, columns = "*") {
    return this.upsert("users", "guild_id, user_id", [guildId, userId], columns);
  }

  sortDefaultValues(row, needed) {
    const columns = Object.keys(row);
    // Create an array of objects of each column mapped to its respective row value.
    const arr = columns.map(c => ({key: c, value: row[c]}));

    // Ensure that the default values are in the same order as the needed values to ensure a valid query.
    return arr.sort((a, b) => needed.indexOf(a.key) - needed.indexOf(b.key)).map(c => c.value);
  }

  stringifyQuery(count) {
    // Table will always have id and at least one other column
    // that's needed, so the for loop needs to start at $3.
    const len = count + 2;
    let values = "$2";

    for (let i = 3; i < len; i++)
      values += `, $${i}`;

    return values;
  }

  async upsert(table, columns, values, returns) {
    const valueStr = this.stringifyQuery(values.length - 1);
    let query = await this.getFirstRow(
      `SELECT ${returns} FROM ${table} WHERE (${columns}) = ($1, ${valueStr})`,
      values
    );

    if (query == null) {
      await this.pool.query(
        `INSERT INTO ${table}(${columns}) VALUES($1, ${valueStr}) ON CONFLICT (${columns}) DO NOTHING`,
        values
      );
      query = await this.getFirstRow(
        `SELECT ${returns} FROM ${table} WHERE (${columns}) = ($1, ${valueStr})`,
        values
      );
    }

    return query;
  }
};
