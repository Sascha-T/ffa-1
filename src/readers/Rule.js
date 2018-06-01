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
const {number} = require("../utilities/regexes.js");
const ruleService = require("../services/rules.js");

module.exports = new class RuleReader extends TypeReader {
  constructor() {
    super({
      type: "rule"
    });
  }

  async read(cmd, msg, arg, args, val, me) {
    const result = val.match(number);

    if (result != null) {
      const categories = await ruleService.getCategories(me, msg.channel.guild.id);
      const category = Number(result) - 1;

      if (Number.isInteger(category) && categories.length < category) {
        const rule = val.slice(result.length);

        if (rule.length < 3) {
          rule = ruleService.countLetters(rule);

          if (rule < categories[category].length)
            return TypeReaderResult.fromSuccess(cmd, categories[category][rule]);
        }

        return TypeReaderResult.fromError(cmd, "you have provided invalid rule letters.");
      }

      return TypeReaderResult.fromError(cmd, "you have provided an invalid rule category number.");
    }

    return TypeReaderResult.fromError(cmd, "you have provided an invalid rule format.");
  }
}();
