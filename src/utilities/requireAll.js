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
// TODO delete this when eval is deleted
const fs = require("fs");
const path = require("path");

function requireAll(dir) {
  const files = fs.readdirSync(dir);
  const res = {};

  for (const file of files) {
    const filepath = `${dir}/${file}`;

    if (fs.lstatSync(filepath).isDirectory() && file.startsWith(".") === false)
      res[file] = requireAll(filepath);
    else if (file.endsWith(".js") === true || file.endsWith(".json") === true)
      res[file.slice(0, file.lastIndexOf("."))] = require(filepath);
  }

  return res;
}

module.exports = {
  serv: requireAll(path.join(__dirname, "../services")),
  util: requireAll(__dirname)
};
