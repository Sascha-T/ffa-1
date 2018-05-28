"use strict";
const util = require("util");
const Logger = require("../utilities/Logger.js");

module.exports = me => {
  me.client.on("ready", async () => {
    try {
      await me.client.editStatus({name: util.format(me.config.bot.game, me.config.bot.prefix)});
      Logger.info("READY");
    } catch (e) {
      Logger.error(e);
    }
  });
};
