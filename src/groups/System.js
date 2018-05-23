"use strict";
const {Group} = require("patron.js");

module.exports = new class SystemGroup extends Group {
  constructor() {
    super({
      description: "System commands directly tied with FFA's functionality.",
      name: "system"
    });
  }
}();
