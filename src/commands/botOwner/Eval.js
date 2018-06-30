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
const patron = require("patron.js");
/* eslint-disable-next-line no-unused-vars */
const {serv, util} = require("../../utilities/requireAll.js");

module.exports = new class Eval extends patron.Command {
  constructor() {
    super({
      args: [new patron.Argument({
        example: "console.log(\"Hello World!\");",
        key: "code",
        name: "code",
        remainder: true,
        type: "string"
      })],
      description: "Evaluates JavaScript code",
      groupName: "botowners",
      names: ["eval", "ev"],
      usableContexts: [patron.Context.DM, patron.Context.Guild]
    });
  }

  async run(msg, args) {
    /* eslint-disable no-unused-vars */
    const {author: user, channel, member} = msg;
    const {guild} = msg.channel;
    /* eslint-enable no-unused-vars */
    let result;

    try {
      result = await eval(args.code);
    } catch (e) {
      result = e;
    }

    if (result instanceof Error) {
      await util.message.create(msg.channel, {fields: [{
        name: "Eval",
        value: util.string.code(args.code)
      },
      {
        name: "Error",
        value: util.string.code(result)
      }]}, serv.cli.config.customColors.error);
    } else {
      await util.message.create(msg.channel, {fields: [{
        name: "Eval",
        value: util.string.code(args.code, args.code === "" ? "" : "js")
      },
      {
        name: "Result",
        value: util.string.code(result === "" ? "Success." : result)
      }]});
    }
  }
}();
