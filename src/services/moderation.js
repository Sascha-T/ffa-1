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
const client = require("./client.js");
const {config} = require("./cli.js");
const Database = require("./Database.js");
const message = require("../utilities/message.js");
const str = require("../utilities/string.js");

module.exports = {
  async addLog(log, color) {
    const {channels: {log_id}, moderation: {case_count}} = await Database.getGuild(log.guild_id, {
      channels: "log_id",
      moderation: "case_count"
    });
    const dup = await this.checkForDup(log, case_count + 1);

    if (dup === true)
      return false;

    await Database.pool.query(
      "INSERT INTO logs(case_number, data, guild_id, timestamp, type, user_id) VALUES($1, $2, $3, $4, $5, $6)",
      [case_count + 1, log.data, log.guild_id, Math.floor(Date.now() / 1e3), log.type, log.user_id]
    );

    if (log_id != null) {
      const channel = client.getChannel(log_id);

      if (channel != null) {
        await message.create(channel, {
          author: log.data.mod_id == null ? null : {name: message.tag(log.data.mod_id)},
          description: this.describeLog(log),
          footer: {text: `Case #${case_count + 1}`},
          timestamp: new Date()
        }, color);
      }
    }

    await Database.pool.query("UPDATE moderation SET case_count = case_count + 1 WHERE id = $1", [log.guild_id]);
  },

  busy: {},

  checkForDup(log) {
    return this.sync(log.guild_id, async () => {
      const query = await Database.pool.query(
        "SELECT case_number FROM logs WHERE guild_id = $1 AND timestamp > current_timestamp - interval '5 seconds'",
        [log.guild_id]
      );

      for (let i = 0; i < query.rows.length; i++) {
        if (query.rows[i].case_number === log.case_number)
          return true;
        else if (query.rows[i].user_id !== log.user_id)
          continue;
        else if (query.rows[i].type !== log.type)
          continue;

        if (log.data != null) {
          let valid = true;

          for (const key in query.rows[i].data) {
            if (query.rows[i].data.hasOwnProperty(key) === false)
              continue;

            if (query.rows[i].data[key] !== log.data[key]) {
              valid = false;
              break;
            }
          }

          if (valid === false)
            continue;
        } else if (query.rows[i].data != null)
          continue;

        return true;
      }

      return false;
    });
  },

  async describeLog(log) {
    let action = "Mute";
    let data = "";

    if (log.type === 1)
      action = "Unmute";
    else if (log.type === 2)
      action = "Automatic Mute";
    else if (log.type === 3)
      action = "Automatic Unmute";

    if (log.data != null) {
      for (const key in log.data) {
        if (log.data.hasOwnProperty(key) === false || key === "mod_id")
          continue;

        data += `\n**${str.capitalize(key)}:** ${log.data[key]}`;
      }
    }

    return `**Action:** ${action}\n**User:** ${message.tag(client.users.get(log.user_id))}${data}`;
  },

  dequeue(guildId) {
    this.busy[guildId] = true;
    const next = this.queue[guildId].shift();

    if (next == null)
      this.busy[guildId] = false;
    else
      this.execute(guildId, next);
  },

  execute(guildId, record) {
    record[0]().then(record[1], record[2]).then(() => this.dequeue(guildId));
  },

  async mute(msg, args) {
    const {roles: {muted_id}} = await Database.getGuild(msg.channel.guild_id, {roles: "muted_id"});

    if (muted_id == null || msg.channel.guild.roles.get(muted_id) == null)
      throw new Error("the muted role has not been set.");

    const res = await this.addLog({
      data: {
        length: args.length,
        reason: args.reason,
        rule: args.rule.content
      },
      guild_id: msg.channel.guild.id,
      type: 0,
      user_id: args.user.id
    }, config.customColors.mute);

    if (res !== false)
      await msg.channel.guild.members.get(args.user.id).addRole(muted_id);
  },

  queues: {},

  sync(guildId, task) {
    return new Promise((res, rej) => {
      if (this.queues.hasOwnProperty(guildId) === false) {
        this.queues[guildId] = [[task, res, rej]];
        this.busy[guildId] = false;
        this.dequeue(guildId);
      } else {
        this.queues[guildId].push([task, res, rej]);

        if (this.busy[guildId] === false)
          this.dequeue(guildId);
      }
    });
  },

  async unmute(msg, args) {
    const {roles: {muted_id}} = await Database.getGuild(msg.channel.guild_id, {roles: "muted_id"});

    if (muted_id == null || msg.channel.guild.roles.get(muted_id) == null)
      throw new Error("the muted role has not been set.");

    // TODO confirm person is muted, isMuted method?

    const res = await this.addLog({
      data: {reason: args.reason},
      guild_id: msg.channel.guild.id,
      type: 1,
      user_id: args.user.id
    }, config.customColors.unmute);

    // TODO confirm user has role
    if (res !== false)
      await msg.channel.guild.members.get(args.user.id).removeRole(muted_id);
  }
};
