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
const {Argument, Command, Context} = require("patron.js");
const cli = require("../../services/cli.js");
const message = require("../../utilities/message.js");
const string = require("../../utilities/string.js");

module.exports = new class EvalCommand extends Command {
  constructor() {
    super({
      args: [new Argument({
        example: "console.log(\"Hello World!\");",
        key: "a",
        name: "code",
        remainder: true,
        type: "string"
      })],
      description: "Evaluates JavaScript code",
      groupName: "botowners",
      names: ["eval", "ev"],
      usableContexts: [Context.DM, Context.Guild]
    });
  }

  async run(msg, args) {
    let result;

    try {
      result = eval(args.a);
    } catch (e) {
      result = e;
    }

    if (result instanceof Error) {
      await message.create(msg.channel, {
        fields: [{
          inline: true,
          name: "Eval",
          value: string.code(args.a)
        }, {
          inline: true,
          name: "Error",
          value: string.code(result)
        }]
      }, cli.config.customColors.error);
    } else {
      await message.create(msg.channel, {
        fields: [{
          inline: true,
          name: "Eval",
          value: string.code(args.a)
        }, {
          inline: true,
          name: "Result",
          value: string.code(result)
        }]
      });
    }
  }
}();
