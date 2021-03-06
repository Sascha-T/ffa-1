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
const db = require("../../services/database.js");
const message = require("../../utilities/message.js");

module.exports = new class Unrep extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "Phantom#1414",
        key: "user",
        name: "user",
        preconditions: ["noself", "nobot"],
        remainder: true,
        type: "user"
      })],
      cooldown: config.cd.unrep * 1e3,
      description: "Remove reputation from any user.",
      groupName: "reputation",
      names: ["unrep"],
      preconditions: ["memberage"]
    });
  }

  async run(msg, args) {
    const {rep: {decrease}} = await db.getGuild(
      msg.channel.guild.id,
      {rep: "decrease"}
    );

    await db.changeRep(msg.channel.guild.id, args.user.id, -decrease);
    await message.reply(
      msg,
      `you have successfully unrepped **${message.tag(args.user)}**.`
    );
  }
}();
