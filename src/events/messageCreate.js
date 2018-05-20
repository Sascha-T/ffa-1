"use strict";
const {spamDuration, spamLimit, spamMuteLength} = require("../config.js");
const Logger = require("../utilities/Logger.js");
module.exports = me => {
  me.client.on("messageCreate", (async msg => {
    //
  }).catch(e => Logger.error(e)));
};
