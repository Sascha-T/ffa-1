"use strict";
const {Group} = require("patron.js");

module.exports = new class BotOwnersGroup extends Group {
  constructor() {
    super({
      description: "Commands reserved for the developers of the bot.",
      name: "botowners",
      preconditions: ["botowners"]
    });
  }
}();
