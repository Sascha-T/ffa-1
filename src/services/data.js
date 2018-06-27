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
const path = require("path");
const {readAll} = require("../utilities/files.js");
const yaml = require("js-yaml");

module.exports = {
  data: false,

  async fetch() {
    if (this.data === false) {
      this.data = await readAll(path.join(__dirname, "../../data"), "utf8");

      for (const key in this.data) {
        if (this.data.hasOwnProperty(key) === false
            || typeof this.data[key] !== "string")
          continue;

        this.data[key] = yaml.load(this.data[key]);
      }

      for (const query in this.data.queries) {
        if (this.data.queries.hasOwnProperty(query) === false)
          continue;

        this.data.queries[query] = this.data.queries[query]
          .replace(this.data.regexes.newline, "");
      }
    }
  }
};
