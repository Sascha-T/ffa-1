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
const {times} = require("./constants.js");

module.exports = {
  clockFormat(ms) {
    let hours = Math.floor((ms / 36e5) % 24);
    let mins = Math.floor((ms / 6e4) % 60);
    let secs = Math.floor((ms / 1e3) % 60);

    if (hours < 10)
      hours = `0${hours}`;

    if (mins < 10)
      mins = `0${mins}`;

    if (secs < 10)
      secs = `0${secs}`;

    return `${hours}:${mins}:${secs}`;
  },

  format(timespan) {
    let largest = "s";
    let smallest = "s";

    for (const time in times) {
      if (times.hasOwnProperty(time) === false)
        continue;

      if (times[largest] < times[time] && timespan > times[time])
        largest = time;
      else if (timespan === times[time])
        return `1${time}`;

      if (times[time] < times[smallest])
        smallest = time;
    }

    if (largest.length !== 0)
      return `${Math.floor(timespan / times[largest] * 10) / 10}${largest}`;

    return `0${smallest}`;
  }
};
