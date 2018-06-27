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
const {
  data: {
    constants: {times},
    regexes: {number}
  }
} = require("../services/data.js");
const keys = Object.keys(times);

module.exports = new class TimeSpan extends TypeReader {
  constructor() {
    super({type: "timespan"});
  }

  async read(cmd, msg, arg, args, val) {
    let result = val.match(number);

    if (result != null) {
      result = Number(result[0]);

      if (Number.isNaN(result) === false) {
        const unit = keys.find(k => val.endsWith(k.charAt(0)) === true);

        if (unit == null)
          result = Math.round(result * times.hour[0]);
        else
          result = Math.round(result * times[unit][0]);

        return TypeReaderResult.fromSuccess(result);
      }
    }

    return TypeReaderResult.fromError(
      cmd,
      "you have provided an invalid time."
    );
  }
}();
