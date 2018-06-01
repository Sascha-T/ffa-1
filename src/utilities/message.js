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
const random = require("./random.js");
const str = require("./string.js");

module.exports = {
  colors: false,

  create(channel, msg, color) {
    if (this.colors === false)
      return console.warn("The message utility needs to be initialized before use.");

    let result = msg.description;

    if (result == null) {
      if (msg.content == null)
        result = msg;
      else
        result = msg.content;
    }

    if (color !== true && (channel.type === 1 ||
        channel.permissionsOf(channel.guild.shard.client.user.id).has("embedLinks"))) {
      if (typeof msg === "string") {
        result = this.embedify({
          color,
          description: msg
        });
      } else
        result = this.embedify(msg);
    }

    return channel.createMessage(result);
  },

  async dm(user, msg, color) {
    if (this.colors === false)
      return console.warn("The message utility needs to be initialized before use.");

    const channel = await user.getDMChannel();
    let result = msg.description;

    if (result == null) {
      if (msg.content == null)
        result = msg;
      else
        result = msg.content;
    }

    if (color !== true) {
      if (typeof msg === "string") {
        result = this.embedify({
          color,
          description: msg
        });
      } else
        result = this.embedify(msg);
    }

    return channel.createMessage(result);
  },

  embedify(options) {
    let embed = {};

    if (typeof options === "string")
      embed.description = options;
    else
      embed = options;

    if (embed.color == null || this.colors.hasOwnProperty(embed.color) === false)
      embed.color = random.element(this.colorValues);
    else
      embed.color = this.colors[embed.color];

    return {
      content: "",
      embed
    };
  },

  init(me) {
    const colors = me.config.colors.map(c => Number(c));
    this.colors = colors;
    this.colorValues = Object.values(colors);
  },

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

  reply(msg, reply, color) {
    if (this.colors === false)
      return console.warn("The message utility needs to be initialized before use.");

    let result = reply.description;

    if (result == null) {
      if (reply.content == null)
        result = reply;
      else
        result = reply.content;
    }

    if (color !== true && (msg.channel.type === 1 ||
        msg.channel.permissionsOf(msg.channel.guild.shard.client.user.id).has("embedLinks"))) {
      if (typeof reply === "string") {
        result = this.embedify({
          color,
          description: `${str.bold(this.tag(msg.author))}, ${reply}`
        });
      } else {
        reply.description = `${str.bold(this.tag(msg.author))}, ${reply.description}`;
        result = this.embedify(reply);
      }
    } else
      result = `${str.bold(this.tag(msg.author))}, ${result}`;

    return msg.channel.createMessage(result);
  },

  role(role) {
    return role.mentionable ? `@${str.escapeFormat(role.name)}` : role.mention;
  },

  tag(user) {
    return `${str.escapeFormat(user.username)}#${user.discriminator}`;
  }
};
