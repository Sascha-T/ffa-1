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
const {format, markdown, uppercase} = require("./regexes.js");

module.exports = {
  bold(str) {
    return `**${str}**`;
  },

  capitalize(str) {
    return str.replace(uppercase, x => String.fromCharCode(x.charCodeAt(0) ^ 32));
  },

  code(str, lang = "js") {
    return `\`\`\`${lang}\n${str}\`\`\``;
  },

  escapeFormat(str) {
    return str.replace(markdown, "\\$&");
  },

  format(str, ...args) {
    return str.replace(format, (m, a) => args[a]);
  }
};
