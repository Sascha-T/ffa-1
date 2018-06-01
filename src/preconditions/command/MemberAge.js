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
const Database = require("../../services/Database.js");

module.exports = new class MemberAgePrecondition extends Precondition {
  constructor() {
    super({
      name: "memberage"
    });
  }

  async run(cmd, msg, opt) {
    const {ages: {member: memberAge}} = await Database.getGuild(msg.channel.guild.id, {ages: "member"});

    if (msg.member.joinedAt == null || msg.member.joinedAt + memberAge * 1e3 > Date.now())
      return PreconditionResult.fromError(
        cmd,
        `this command may only be used by members who have been in this guild for at least ${Math.floor(memberAge / 8640) / 10} days.`
      );

    return PreconditionResult.fromSuccess();
  }
}();
