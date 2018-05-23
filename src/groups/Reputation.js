"use strict";
const {Group} = require("patron.js");

module.exports = new class ReputationGroup extends Group {
  constructor() {
    super({
      description: "Commands dedicated to managing the reputation system.",
      name: "reputation"
    });
  }
}();
