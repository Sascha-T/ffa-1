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
const {
  data: {
    regexes: {
      format,
      markdown
    },
    responses
  }
} = require("../services/data.js");

module.exports = {
  capitalize(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  },

  code(str, lang = "js") {
    return `\`\`\`${lang}\n${str}\`\`\``;
  },

  escapeFormat(str) {
    return str.replace(markdown, "\\$&");
  },

  format(str, ...args) {
    return str.replace(format, (m, a) => args[a]);
  },

  list(arr, or = "and") {
    if (arr.length < 3)
      return arr.join(or === false ? ", " : ` ${or} `);

    return this.format(
      responses.list,
      arr.slice(0, -1).join(", "),
      or === false ? "" : `${or} `,
      arr[arr.length - 1]
    );
  },

  pluralize(str) {
    return str.endsWith("s") === true ? `${str}'` : `${str}'s`;
  }
};
