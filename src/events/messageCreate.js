"use strict";
const Logger = require("../utilities/Logger.js");

module.exports = me => {
  me.client.on("messageCreate", async msg => {
    try {
      //
    }catch(e) {
      Logger.error(e);
    }
  });
};
