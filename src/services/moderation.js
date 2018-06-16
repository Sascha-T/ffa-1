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
const time = require("../utilities/time.js");

module.exports = {
  async addLog(log, color) {
    const {channels: {log_id}, moderation: {case_count}} = await Database.getGuild(log.guild_id, {
      channels: "log_id",
      moderation: "case_count"
    });
    let msg;

    await Database.pool.query(
      "INSERT INTO logs(case_number, data, guild_id, timestamp, type, user_id) VALUES($1, $2, $3, $4, $5, $6)",
      [case_count + 1, log.data, log.guild_id, Math.floor(Date.now() / 1e3), log.type, log.user_id]
    );
    await Database.pool.query("UPDATE moderation SET case_count = case_count + 1 WHERE id = $1", [log.guild_id]);

    if (log_id != null) {
      const channel = client.getChannel(log_id);

      if (channel != null) {
        const user = log.data == null || log.data.mod_id == null ? null : client.users.get(log.data.mod_id);
        msg = message.create(channel, {
          author: user == null ? null : {
            icon_url: user.avatarURL,
            name: `${message.tag(user)} (${log.data.mod_id})`
          },
          description: await this.describeLog(log),
          footer: {text: `Case #${case_count + 1}`},
          timestamp: new Date()
        }, color);
      }
    }

    return [msg, case_count + 1];
  },

  autoMute(msg, length) {
    return this.sync(msg.channel.guild.id, async () => {
      const {roles: {muted_id}} = await Database.getGuild(msg.channel.guild.id, {roles: "muted_id"});

      if (muted_id == null || msg.channel.guild.roles.get(muted_id) == null)
        return false;

      const isMuted = await this.isMuted(msg.channel.guild.id, msg.author.id, muted_id);

      if (isMuted === true)
        return false;

      const data = {
        data: {length},
        guild_id: msg.channel.guild.id,
        type: 2,
        user_id: msg.author.id
      };
      const [logMsg, caseNum] = await this.addLog(data, config.customColors.mute);

      try {
        const member = msg.channel.guild.members.get(msg.author.id);

        if (member.roles.indexOf(muted_id) === -1)
          await member.addRole(muted_id);
      } catch (e) {
        await this.removeLog(e, logMsg, caseNum, true);
      }
    });
  },

  autoUnmute(log) {
    return this.sync(log.guild_id, async () => {
      const {roles: {muted_id}} = await Database.getGuild(log.guild_id, {roles: "muted_id"});
      const guild = client.guilds.get(log.guild_id);

      if (muted_id == null || guild.roles.get(muted_id) == null)
        return true;

      const isMuted = await this.isMuted(log.guild_id, log.user_id, muted_id);

      if (isMuted === false)
        return false;

      const data = {
        guild_id: log.guild_id,
        type: 3,
        user_id: log.user_id
      };
      const [logMsg, caseNum] = await this.addLog(data, config.customColors.unmute);

      try {
        const member = guild.members.get(log.user_id);

        if (member.roles.indexOf(muted_id) !== -1)
          await member.removeRole(muted_id);
      } catch (e) {
        await this.removeLog(e, logMsg, caseNum, true);
        return false;
      }
    });
  },

  busy: {},

  dequeue(guildId) {
    this.busy[guildId] = true;
    const next = this.queues[guildId].shift();

    if (next == null)
      this.busy[guildId] = false;
    else
      this.execute(guildId, next);
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
    else if (log.type === 4)
      action = "Clear";

    if (log.data != null) {
      for (const key in log.data) {
        if (log.data.hasOwnProperty(key) === false || key === "mod_id")
          continue;

        let val = log.data[key];

        if (val == null)
          continue;
        else if (key === "length")
          val = time.format(val);

        data += `\n**${str.capitalize(key)}:** ${val}`;
      }
    }

    return `**Action:** ${action}\n**User:** ${message.tag(client.users.get(log.user_id))} (${log.user_id})${data}`;
  },

  execute(guildId, record) {
    let finished = false;

    record[0]().then(record[1], record[2]).then(() => {
      finished = true;
      this.dequeue(guildId);
    });

    setTimeout(async () => {
      if (finished === false) {
        this.dequeue(guildId);

        let inspect = require("util").inspect(record, {depth: 10});
        await message.dm(client.users.get("222093436520628225"), inspect.slice(0, 2e3), null, true);
        throw new Error(`Record took over 30s to finish: ${inspect}`);
      }
    }, 3e4);
  },

  async isMuted(guildId, userId, mutedRole) {
    let query = await Database.pool.query(
      "SELECT data, timestamp FROM logs WHERE guild_id = $1 AND user_id = $2 AND type = 0 OR type = 2 ORDER BY timestamp DESC LIMIT 1",
      [guildId, userId]
    );
    const member = client.guilds.get(guildId).members.get(userId);

    if (member == null || member.roles.indexOf(mutedRole) === -1 || query.rows.length === 0)
      return false;

    const muteTimestamp = query.rows.length === 0 ? null : query.rows[0].timestamp;
    query = await Database.pool.query(
      "SELECT data, timestamp FROM logs WHERE guild_id = $1 AND user_id = $2 AND type = 1 OR type = 3 ORDER BY timestamp DESC LIMIT 1",
      [guildId, userId]
    );

    if (query.rows.length !== 0 && query.rows[0].timestamp > muteTimestamp)
      return false;

    return true;
  },

  mute(msg, args) {
    return this.sync(msg.channel.guild.id, async () => {
      const {roles: {muted_id}} = await Database.getGuild(msg.channel.guild.id, {roles: "muted_id"});

      if (muted_id == null || msg.channel.guild.roles.get(muted_id) == null)
        throw new Error("the muted role has not been set.");

      const isMuted = await this.isMuted(msg.channel.guild.id, args.user.id, muted_id);

      if (isMuted === true)
        return message.reply(msg, "this command may not be used on a muted user.");

      const data = {
        data: {
          length: args.length,
          mod_id: msg.author.id,
          reason: args.reason,
          rule: args.rule.content.content
        },
        guild_id: msg.channel.guild.id,
        type: 0,
        user_id: args.user.id
      };
      const [logMsg, caseNum] = await this.addLog(data, config.customColors.mute);

      try {
        const tag = message.tag(msg.author);
        const member = msg.channel.guild.members.get(args.user.id);

        if (member.roles.indexOf(muted_id) === -1)
          await member.addRole(muted_id);

        await message.reply(msg, `you have successfully muted **${message.tag(args.user)}**.`);
        await message.dm(args.user, `**${tag}** has muted you for **${time.format(args.length)}** for breaking the foll\
owing rule:${str.code(args.rule.content.content, "")}${args.reason}\n**If this mute was unjustified or invalid, there a\
re several steps you must take to vindicate yourself:**\n\n**1.** You must \`${config.bot.prefix}unrep "${tag}"\`. This\
 is essential as it will prevent **${tag}** from unjustly muting others. This command must be used inside a guild chann\
el. If there are no channels dedicated to allow muted users to use commands, please contact **\
${message.tag(client.users.get(msg.channel.guild.ownerID))}**.\n\n**2.** You must use \`${config.bot.prefix}replb 30\` \
to DM these moderators with undeniable proof of your innocence. You must explain in detail why **${tag}'s** mute was in\
valid, and why it should be reverted.\n\n**3.** You must ensure **${tag}** get's muted for unlawful punishment. You may\
 do this by lobbying other moderators, or by gaining enough reputation to do it yourself. If there is no unlawful punis\
hment rule, create a poll which adds it, and lobby other users to vote in favor of said poll.`).catch(e => {});
      } catch (e) {
        await this.removeLog(e, logMsg, caseNum);
      }
    });
  },

  queues: {},

  async removeLog(err, msg, caseNum, silent = false) {
    const logMsg = await msg;

    await Database.pool.query("DELETE FROM logs WHERE case_number = $1", [caseNum]);
    await Database.pool.query(
      "UPDATE moderation SET case_count = case_count - 1 WHERE id = $1",
      [logMsg.channel.guild.id]
    );
    await logMsg.delete();

    if (silent === false)
      throw err;
  },

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

  unmute(msg, args) {
    return this.sync(msg.channel.guild.id, async () => {
      const {roles: {muted_id}} = await Database.getGuild(msg.channel.guild.id, {roles: "muted_id"});

      if (muted_id == null || msg.channel.guild.roles.get(muted_id) == null)
        throw new Error("the muted role has not been set.");

      const isMuted = await this.isMuted(msg.channel.guild.id, args.user.id, muted_id);

      if (isMuted === false)
        return message.reply(msg, "this command may only be used on a muted user.");

      const data = {
        data: {
          mod_id: msg.author.id,
          reason: args.reason
        },
        guild_id: msg.channel.guild.id,
        type: 1,
        user_id: args.user.id
      };

      const [logMsg, caseNum] = await this.addLog(data, config.customColors.unmute);
      try {
        const member = msg.channel.guild.members.get(args.user.id);

        if (member.roles.indexOf(muted_id) !== -1)
          await member.removeRole(muted_id);

        await message.reply(msg, `you have successfully unmuted **${message.tag(args.user)}**.`);
      } catch (e) {
        await this.removeLog(e, logMsg, caseNum);
      }
    });
  }
};
