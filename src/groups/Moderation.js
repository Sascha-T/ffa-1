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
const {Group} = require("patron.js");
const {data: {descriptions}} = require("../services/data.js");

module.exports = new class Moderation extends Group {
  constructor() {
    super({
      description: descriptions.moderation,
      name: "moderation",
      postconditions: ["maxactions"],
      preconditionOptions: [null, null, {column: "mod"}],
      preconditions: ["maxactions", "modrole", "top"]
    });
  }
}();
