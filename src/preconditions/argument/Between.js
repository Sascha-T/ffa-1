"use strict";
const {ArgumentPrecondition, PreconditionResult} = require("patron.js");

module.exports = new class Between extends ArgumentPrecondition {
  constructor() {
    super({
      name: "between"
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (value >= options.minimum && value <= options.maximum)
      return PreconditionResult.fromSuccess();
    return PreconditionResult.fromError(command, `The ${argument.name} must be in between ${options.minimum} and ${options.minimum}.`);
  }
}();
