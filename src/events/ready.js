"use strict";
const {game: name} = require("../config.js");
const Logger = require("../utilities/Logger.js");
module.exports = me => {
  me.client.on("ready", (async () => {
    me.client.editStatus({name});
  }).catch(e => Logger.error(e)));
};
