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
const {CommandError} = require("patron.js");
const client = require("../services/client.js");
const {config} = require("../services/cli.js");
const Database = require("../services/Database.js");
const {discordErrorCodes} = require("../utilities/constants.js");
const handler = require("../services/handler.js");
const Logger = require("../utilities/Logger.js");
const message = require("../utilities/message.js");
const wrapEvent = require("../utilities/wrapEvent.js");
const cooldowns = {};
const ratelimited = {};

client.on("messageCreate", wrapEvent(async msg => {
  let guild;

  if (msg.author.bot === true || msg.embeds.length !== 0)
    return false;
  else if (ratelimited[msg.author.id] != null) {
    if (ratelimited[msg.author.id] < Date.now())
      return false;
    else
      ratelimited[msg.author.id] = undefined;
  }

  if (msg.channel.guild != null) {
    guild = await Database.getGuild(msg.channel.guild.id, {
      channels: "ignored_ids",
      chat: "delay, reward",
      moderation: "auto_mute",
      roles: "muted_id"
    });

    if (guild.moderation.auto_mute === true) {
      // TODO spam service
    }

    if (msg.member.roles.indexOf(guild.roles.muted_id) !== -1 ||
        guild.channels.ignored_ids.indexOf(msg.channel.id) !== -1)
      return false;

    if (msg.content.indexOf(config.bot.prefix) !== 0 && (cooldowns.hasOwnProperty(msg.author.id) === false
        || cooldowns[msg.author.id] >= Date.now())) {
      cooldowns[msg.author.id] = Date.now() + guild.chat.delay;
      await Database.changeRep(msg.channel.guild.id, msg.author.id, guild.chat.reward);
    }
  }

  const result = await handler.run(msg, config.bot.prefix.length);

  if (result.commandError === CommandError.CommandNotFound) {
    // TODO custom commands, cooldown reply, and tag prefix to replies.
  } else if (result.success === false && result.commandError !== CommandError.Cooldown && result.commandError !== CommandError.InvalidContext) {
    let reply = "";

    if (result.commandError === CommandError.Exception) {
      reply = result.error.message;
      if (result.error.constructor.name === "DiscordHTTPError" ||
          result.error.constructor.name === "DiscordRESTError") {
        if (result.error.code === discordErrorCodes.userOnly)
          reply = "only a user account may perform this action.";
        else if (result.error.code === discordErrorCodes.cantDM)
          reply = "I can't DM you. Please allow direct messages from guild users.";
        else if (discordErrorCodes.noPerm(result.error.code))
          reply = "I don't have permission to do that.";
        else if (result.error.code === discordErrorCodes.bulkDelete)
          reply = "Discord doesn't allow bulk deletion of messages that are more than two weeks old.";
        else if (discordErrorCodes.internalError(result.error.code))
          reply = "an unexpected error has occurred, please try again later.";
        else if (result.error.message.indexOf("Request timed out (>15000ms)") === 0)
          reply = "the request has timed out, please try again later.";
        else
          Logger.error(result.error);
      } else {
        Logger.error(result.error);
        reply = result.error.message;
      }
    } else if (result.commandError === CommandError.BotPermission)
      reply = "I don't have permission to do that.";
    else if (result.commandError === CommandError.MemberPermission)
      reply = "you don't have permission to do that.";
    else if (result.commandError === CommandError.InvalidArgCount)
      reply = `you are incorrectly using this command.\n**Usage:** \`${config.bot.prefix}${result.command.getUsage()}\`\n**Example:** \`${config.bot.prefix}${result.command.getExample()}\``;
    else if (result.commandError === CommandError.Precondition ||
          result.commandError === CommandError.TypeReader)
      reply = result.errorReason;
    else {
      Logger.error(result.error);
      reply = result.error.message;
    }

    await message.replyError(msg, reply);
  }
}));
