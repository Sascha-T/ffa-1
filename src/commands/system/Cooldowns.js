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
const {Argument, ArgumentDefault, Command} = require("patron.js");
const message = require("../../utilities/message.js");
const registry = require("../../services/registry.js");
const str = require("../../utilities/string.js");
const time = require("../../utilities/time.js");

module.exports = new class CooldownsCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        defaultValue: ArgumentDefault.Author,
        example: "jimbo#8237",
        key: "user",
        name: "user",
        type: "user"
      })],
      description: "View anyone's command cooldowns.",
      groupName: "system",
      names: ["cooldowns", "cooldown", "cds", "cd"]
    });
  }

  async run(msg, args) {
    const cooldowns = {};

    for (let i = 0; i < registry.commands.length; i++) {
      if (registry.commands[i].hasCooldown === true) {
        const cooldown = registry.commands[i]
        .cooldowns[`${args.user.id}${msg.channel.guild === null ? "" : `-${msg.channel.guild.id}`}`];

        if (cooldown !== undefined) {
          const diff = cooldown - Date.now();

          if (diff > 0)
            cooldowns[registry.commands[i].names[0]] = diff;
        }
      }
    }

    const keys = Object.keys(cooldowns);

    if (keys.length === 0) {
      if (args.user.id === msg.author.id)
        await message.reply(msg, "all your commands are available for use.");
      else
        await message.create(msg.channel, `All of **${message.tag(args.user)}**'s commands are available for use.`);
    } else {
      await message.create(msg.channel, {
        description: keys.map(k => `**${str.capitalize(k)}**: ${time.clockFormat(cooldowns[k])}`).join("\n"),
        title: `${message.tag(args.user)}'s Cooldowns`
      });
    }
  }
}();
