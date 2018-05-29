/**
 * FFA - The core control of the free-for-all discord server.
 * Copyright (c) 2018 FFA contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
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
  licenseNotice: "FFA Copyright (c) 2018 FFA contributors.\nThis program comes with ABSOLUTELY NO WARRANTY.\nThis is free software, and you are welcome to redistribute it under\ncertain conditions. Use the argument `-l` for more details.",
  logColors: {
    DEBUG: "\x1b[35m",
    ERROR: "\x1b[31m",
    INFO: "\x1b[32m",
    WARN: "\x1b[33m"
  }
};
/* eslint-enable no-magic-numbers */
