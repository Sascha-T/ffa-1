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
const {Argument, Command, CommandResult} = require("patron.js");
const {config} = require("../../services/cli.js");
const {data: {descriptions, responses}} = require("../../services/data.js");
const message = require("../../utilities/message.js");
const modService = require("../../services/moderation.js");
const str = require("../../utilities/string.js");

module.exports = new class Clear extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "SteveJr#3333",
        key: "user",
        name: "user",
        preconditions: ["noself", "noffa", "higherrep"],
        type: "user"
      }),
      new Argument({
        example: "3a",
        key: "rule",
        name: "rule",
        type: "rule"
      }),
      new Argument({
        defaultValue: config.default.clear,
        example: "20",
        key: "quantity",
        name: "quantity",
        preconditionOptions: [{
          max: config.max.clear,
          min: config.min.clear
        }],
        preconditions: ["between"],
        type: "integer"
      }),
      new Argument({
        defaultValue: null,
        example: "stop spamming",
        key: "reason",
        name: "reason",
        preconditionOptions: [{max: config.max.reasonLength}],
        preconditions: ["maxlength"],
        remainder: true,
        type: "string"
      })],
      botPermissions: ["manageRoles"],
      description: descriptions.clear,
      groupName: "moderation",
      names: ["clear", "prune", "purge"]
    });
  }

  async run(msg, args) {
    let quota = 0;
    const amount = await msg.channel.purge(
      100,
      m => m.author.id === args.user.id && ++quota <= args.quantity
    );

    if (amount === 0)
      return CommandResult.fromError("there are no messages to delete.");

    await modService.addLog({
      data: {
        mod_id: msg.author.id,
        quantity: amount,
        reason: args.reason,
        rule: args.rule.content
      },
      guild_id: msg.channel.guild.id,
      type: 4,
      user_id: args.user.id
    }, config.customColors.clear);
    await message.reply(msg, str.format(
      responses.clearReply,
      amount,
      message.tag(args.user)
    ));
  }
}();
