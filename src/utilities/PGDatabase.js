"use strict";
const {Pool} = require("pg");

module.exports = class PGDatabase {
  constructor(options) {
    this.pool = new Pool(options);
  }

  async getGuild(id, columns = "*") {
    let {rows: [result]} = await this.pool.query(`select ${columns} from guilds where id = $1`, [id]);

    if (result == null && typeof id === "string")
      [result] = (await this.pool.query(`insert into guilds(id) values($1) returning ${columns}`, [id])).rows;

    return result;
  }

  async getUser(guildId, userId, columns = "*") {
    let {rows: [result]} = await this.pool.query(`select ${columns} from users where (guild_id, user_id) = ($1, $2)`, [guildId, userId]);

    if (result == null && typeof id === "string")
      [result] = (await this.pool.query(`insert into users(guild_id, user_id) values($1, $2) returning ${columns}`, [guildId, userId])).rows;

    return result;
  }

  async giveRep(guildId, userId, reputation) {
    return this.pool.query(
      "insert into users(guild_id, user_id, reputation) values($1, $2, $3) on conflict (guild_id, user_id) do update set reputation = reputation + $1 where (guild_id, user_id) = ($1, $2)",
      [guildId, userId, reputation]
    );
  }
};
