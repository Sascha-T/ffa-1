"use strict";
const {Argument, Command, Context} = require("patron.js");
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
      names: ["eval"],
      usableContexts: [Context.DM, Context.Guild]
    });
  }
  async run(msg, args, me) {
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
      }, "error");
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
