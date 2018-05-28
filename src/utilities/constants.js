"use strict";
/* eslint-disable no-magic-numbers */
module.exports = {
  clearDeleteDelay: 3e3,
  deletedMsgChars: 200,
  discordErrorCodes: {
    bulkDelete: 50034,
    cantDM: 50007,
    internalError: code => code > 499 && code < 600,
    noPerm: code => code === 403 || code === 50013,
    userOnly: 20001
  },
  logColors: {
    DEBUG: "\x1b[35m",
    ERROR: "\x1b[31m",
    INFO: "\x1b[32m",
    WARN: "\x1b[33m"
  }
};
/* eslint-enable no-magic-numbers */
