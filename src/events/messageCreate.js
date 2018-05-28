"use strict";
const {CommandError} = require("patron.js");
const {discordErrorCodes} = require("../utilities/constants.js");
const Logger = require("../utilities/Logger.js");
const message = require("../utilities/message.js");
const cooldowns = {};
const ratelimited = {};

module.exports = me => {
  me.client.on("messageCreate", async msg => {
    try {
      let guild;

      if (msg.author.bot === true || msg.embeds.length !== 0)
        return false;
      else if (ratelimited.hasOwnProperty(msg.author.id)) {
        if (ratelimited[msg.author.id] < Date.now())
          return false;
        else
          delete ratelimited[msg.author.id];
      }

      if (msg.channel.guild != null) {
        guild = await me.db.getGuild(msg.channel.guild.id, {
          channels: "ignored_ids",
          moderation: "auto_mute",
          roles: "muted_id"
        });

        if (guild.moderation.auto_mute === true) {
          // TODO spam service
        }

        if (msg.member.roles.indexOf(guild.roles.muted_id) !== -1 ||
            guild.channels.ignored_ids.indexOf(msg.channel.id) !== -1)
          return false;

        if (me.handler.argumentRegex.test(msg.content) === false && (cooldowns.hasOwnProperty(msg.author.id) === false
            || cooldowns[msg.author.id] >= Date.now())) {
          cooldowns[msg.author.id] = Date.now() + me.config.chatServiceDelay;
          await me.db.changeRep(msg.channel.guild.id, msg.author.id, me.config.chatReward);
        }
      }

      const result = await me.handler.run(msg, me.config.bot.prefix.length, me);

      if (result.success === true)
        result.command.uses++;
      else if (result.commandError === CommandError.CommandNotFound) {
        // TODO custom commands, cooldown reply, and tag prefix to replies.
      } else if (result.commandError !== CommandError.Cooldown && result.commandError !== CommandError.InvalidContext) {
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
          reply = `you are incorrectly using this command.\n**Usage:** \`${me.config.bot.prefix}${result.command.getUsage()}\`\n**Example:** \`${me.config.bot.prefix}${result.command.getExample()}\``;
        else if (result.commandError === CommandError.Precondition ||
              result.commandError === CommandError.TypeReader)
          reply = result.errorReason;
        else {
          Logger.error(result.error);
          reply = result.error.message;
        }

        await message.reply(msg, reply, "error");
      }
    } catch (e) {
      Logger.error(e);
    }
  });
};
