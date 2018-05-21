"use strict";
const Logger = require("../utilities/Logger.js");

module.exports = me => {
  me.client.on("ready", async () => {
    try {
      await me.client.editStatus({name: me.config.game});
      Logger.info("READY");
    }catch(e) {
      Logger.error(e);
    }
  });
};
