/**
 * FFA - The core control of the free-for-all discord server.
 * Copyright (c) 2018 FFA contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";
const {TypeReader, TypeReaderResult} = require("patron.js");
const {times} = require("../utilities/constants.js");
const {number} = require("../utilities/regexes.js");
const keys = Object.keys(times);

module.exports = new class TimeSpanReader extends TypeReader {
  constructor() {
    super({
      type: "timespan"
    });
  }

  async read(cmd, msg, arg, args, val, me) {
    let result = val.match(number);

    if (result != null) {
      result = Number(result[0]);

      if (Number.isNaN(result) === false) {
        const lastIndex = val.length - 1;

        if (keys.some(k => val.indexOf(k) === lastIndex) === true)
          result = Math.round(result * times[val.charAt(lastIndex)]);

        return TypeReaderResult.fromSuccess(result);
      }
    }

    return TypeReaderResult.fromError(cmd, "you have provided an invalid time.");
  }
}();
