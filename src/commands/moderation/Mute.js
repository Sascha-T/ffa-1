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
const {Argument, Command} = require("patron.js");
const {config} = require("../../services/cli.js");
const message = require("../../utilities/message.js");
const modService = require("../../services/moderation.js");
const time = require("../../utilities/time.js");

module.exports = new class MuteCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "Jimbo#5555",
        key: "user",
        name: "user",
        preconditions: ["noself", "higherrep"],
        type: "user"
      }), new Argument({
        example: "2c",
        key: "rule",
        name: "rule",
        type: "rule"
      }), new Argument({
        example: "8h",
        key: "length",
        name: "length",
        type: "timespan"
      }), new Argument({
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
      description: "Mute any guild user.",
      groupName: "moderation",
      names: ["mute"]
    });
  }

  async run(msg, args) {
    if (args.rule.mute_length != null && args.length > args.rule.mute_length) {
      await message.replyError(
        msg,
        `the maximum mute length of this rule is ${time.format(args.rule.mute_length)}.`
      );
    } else
      await modService.mute(msg, args);
  }
}();
