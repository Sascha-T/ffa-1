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
const client = require("../services/client.js");
const {config} = require("../services/cli.js");
const Database = require("../services/Database.js");
const message = require("../utilities/message.js");
const modService = require("../services/moderation.js");
const str = require("../utilities/string.js");
const wrapEvent = require("../utilities/wrapEvent.js");
const helpMsg = str.format(config.guild.helpMsg, config.bot.prefix, config.guild.invite);

client.on("guildMemberAdd", wrapEvent(async (guild, member) => {
  message.dm(member.user, {
    description: helpMsg,
    title: "Welcome to FFA"
  }).catch(() => {});

  await Database.pool.query(
    "UPDATE users SET in_guild = true WHERE (guild_id, user_id) = ($1, $2)",
    [guild.id, member.id]
  );

  const {roles: {muted_id}} = await Database.getGuild(guild.id, {roles: "muted_id"});
  const isMuted = await modService.isMuted(guild.id, member.id, muted_id);

  if (isMuted === true && muted_id != null)
    await member.addRole(muted_id);
}));
