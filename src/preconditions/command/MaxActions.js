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
const {Precondition, PreconditionResult} = require("patron.js");
const {config} = require("../../services/cli.js");
const Database = require("../../services/Database.js");
const maxActions = {};
const delay = config.timer.resetActions * 1e3;

module.exports = new class MaxActionsPrecondition extends Precondition {
  constructor() {
    super({
      name: "maxactions"
    });
  }

  async loop() {
    for (const key in maxActions) {
      if (maxActions.hasOwnProperty(key) === false)
        continue;

      maxActions[key] = {first: 0};
    }

    setTimeout(() => this.loop(), delay);
  }

  async run(cmd, msg) {
    const {moderation: {max_actions}} = await Database.getGuild(msg.channel.guild.id, {moderation: "max_actions"});

    if (maxActions.hasOwnProperty(msg.author.id) === false ||
        Date.now() - maxActions[msg.author.id] > 36e5) {
      maxActions[msg.author.id] = {
        count: 1,
        first: Date.now()
      };

      return PreconditionResult.fromSuccess();
    }

    maxActions[msg.author.id].count++;

    if (maxActions[msg.author.id].count >= max_actions) {
      return PreconditionResult.fromError(
        cmd,
        `you have reached the ${max_actions} maximum moderation actions per hour.`
      );
    }

    return PreconditionResult.fromSuccess();
  }
}();
