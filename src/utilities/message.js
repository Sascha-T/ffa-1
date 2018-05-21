"use strict";
const config = require("../config.js");
const random = require("./random.js");

module.exports = {
  async dm(user, msg, color) {
    const channel = await user.getDMChannel();
    let result = msg.description;

    if(result == null) {
      if(msg.content == null)
        result = msg;
      else
        result = msg.content;
    }

    if(color !== true) {
      if(typeof msg === "string") {
        result = module.exports.embedify({
          color,
          description: msg
        });
      }else
        result = module.exports.embedify(msg);
    }

    return channel.createMessage(result);
  },

  create(channel, msg, color) {
    let result = msg.description;

    if(result == null) {
      if(msg.content == null)
        result = msg;
      else
        result = msg.content;
    }

    if(color !== true && (channel.type === 1 ||
        channel.permissionsOf(channel.guild.shard.client.user.id).has("embedLinks"))) {
      if(typeof msg === "string") {
        result = module.exports.embedify({
          color,
          description: msg
        });
      }else
        result = module.exports.embedify(msg);
    }

    return channel.createMessage(result);
  },

  embedify(options) {
    let embed = {};

    if(typeof options === "string")
      embed.description = options;
    else
      embed = options;

    const prop = `${embed.color}Color`;

    if(embed.color == null || config.hasOwnProperty(prop) === false)
      embed.color = random.element(config.colors);
    else
      embed.color = config[prop];

    embed.timestamp = embed.timestamp == null ? new Date() : embed.timestamp;

    return {
      content: "",
      embed
    };
  },

  list(objs, name, desc) {
    let longest = objs[0][name].length + 2;

    for(let a = 1; a < objs.length; a++) {
      if(objs[a][name].length > longest)
        longest = objs[a][name].length + 2;
    }

    return `\`\`\`\n${objs.map(val => {
      return `${val[name]}${" ".repeat(longest - val[name].length)}${val[desc]}`;
    }).join("\n")}\`\`\``;
  },

  role(role) {
    return role.mentionable ? `@${role.name}` : role.mention;
  },

  tag(user) {
    return `${user.username}#${user.discriminator}`;
  }
};
