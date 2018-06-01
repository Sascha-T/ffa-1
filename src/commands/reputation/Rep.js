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
const Database = require("../../services/Database.js");
const message = require("../../utilities/message.js");
const str = require("../../utilities/string.js");

module.exports = new class RepCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "AlabamaTrigger#0001",
        key: "a",
        name: "user",
        preconditions: ["noself"],
        type: "user"
      })],
      cooldown: config.cd.rep,
      description: "Give reputation to any user.",
      groupName: "reputation",
      names: ["rep"],
      preconditions: ["memberage"]
    });
  }

  async run(msg, args) {
    const {rep: {increase}} = await Database.getGuild(msg.channel.guild.id, {rep: "increase"});

    await Database.changeRep(msg.channel.guild.id, args.a.id, increase);
    await message.reply(msg, `you have successfully repped ${str.bold(message.tag(args.a))}.`);
  }
}();
