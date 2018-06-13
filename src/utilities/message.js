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
const client = require("../services/client.js");
const {config} = require("../services/cli.js");
const random = require("./random.js");
const str = require("./string.js");

module.exports = {
  canUseRole(guild, role) {
    const member = guild.members.get(client.user.id);

    if (member.permission.has("manageRoles") === false)
      return false;

    const highest = 0;

    for (let i = 0; i < member.roles.length; i++) {
      const pos = guild.roles.get(member.roles[i]).position;

      if (pos > highest)
        highest = pos;
    }

    return highest > role.position;
  },

  colors: config.colors,

  create(channel, msg, color, override = false) {
    let result = msg.description;

    if (result == null) {
      if (msg.content == null)
        result = msg;
      else
        result = msg.content;
    }

    if (override !== true && (channel.guild == null ||
        channel.permissionsOf(channel.guild.shard.client.user.id).has("embedLinks"))) {
      if (typeof msg === "string") {
        result = this.embedify({
          color,
          description: msg
        });
      } else
        result = this.embedify({color, ...msg});
    }

    return channel.createMessage(result);
  },

  // TODO delete when eval is removed
  createError(channel, msg) {
    return this.create(channel, msg, this.errorColor);
  },

  async dm(user, msg, color, override = false) {
    const channel = await user.getDMChannel();
    let result = msg.description;

    if (result == null) {
      if (msg.content == null)
        result = msg;
      else
        result = msg.content;
    }

    if (override !== true) {
      if (typeof msg === "string") {
        result = this.embedify({
          color,
          description: msg
        });
      } else
        result = this.embedify({color, ...msg});
    }

    return channel.createMessage(result);
  },

  embedify(options) {
    let embed = {};

    if (typeof options === "string")
      embed.description = options;
    else
      embed = options;

    if (embed.color == null)
      embed.color = random.element(this.colors);

    return {
      content: "",
      embed
    };
  },

  errorColor: config.customColors.error,

  list(objs, name, desc) {
    let longest = objs[0][name].length + 2;

    for (let i = 1; i < objs.length; i++) {
      if (objs[i][name].length > longest)
        longest = objs[i][name].length + 2;
    }

    return `\`\`\`\n${objs.map(val => {
      return `${val[name]}${" ".repeat(longest - val[name].length)}${val[desc]}`;
    }).join("\n")}\`\`\``;
  },

  reply(msg, reply, color, override = false) {
    let result = reply.description;

    if (result == null) {
      if (reply.content == null)
        result = reply;
      else
        result = reply.content;
    }

    if (override !== true && (msg.channel.guild == null ||
        msg.channel.permissionsOf(msg.channel.guild.shard.client.user.id).has("embedLinks"))) {
      if (typeof reply === "string") {
        result = this.embedify({
          color,
          description: `**${this.tag(msg.author)}**, ${reply}`
        });
      } else {
        reply.description = `**${this.tag(msg.author)}**, ${reply.description}`;
        result = this.embedify({color, ...reply});
      }
    } else
      result = `**${this.tag(msg.author)}**, ${result}`;

    return msg.channel.createMessage(result);
  },

  replyError(msg, reply) {
    return this.reply(msg, reply, this.errorColor);
  },

  role(role) {
    return role.mentionable ? `@${str.escapeFormat(role.name)}` : role.mention;
  },

  tag(user) {
    return `${str.escapeFormat(user.username)}#${user.discriminator}`;
  }
};
