"use strict";
const {CommandError} = require("patron.js");
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

      if (msg.channel.type === 0) {
        guild = await me.db.getGuild(msg.channel.guild.id, "auto_mute, muted_role_id, ignored_channel_ids");

        if (guild.auto_mute === true) {
          // TODO spam service
        }

        if (msg.member.roles.indexOf(guild.muted_role_id) !== -1 || guild.ignored_channel_ids.indexOf(msg.channel.id))
          return false;

        if (msg.content.test(me.handler.argumentRegex) === false && (cooldowns.hasOwnProperty(msg.author.id) === false
            || cooldowns[msg.author.id] >= Date.now())) {
          cooldowns[msg.author.id] = Date.now() + me.config.chatServiceDelay;
          await me.db.giveRep(msg.channel.guild.id, msg.author.id, me.config.chatReward);
        }
      }

      const result = await me.handler.run(msg, me.config.prefix.length, me);

      if (result.success === true)
        result.command.uses++;
      else if (result.commandError === CommandError.CommandNotFound) {
        // TODO custom commands
      } else if (result.commandError !== CommandError.Cooldown && result.commandError !== CommandError.InvalidContext) {
        let reply = "";

        if (result.commandError === CommandError.Exception) {
          reply = result.error.message;
          if (result.error.constructor.name === "DiscordHTTPError" ||
              result.error.constructor.name === "DiscordRESTError") {
            if (result.error.code === 20001)
              reply = "Only a user account may perform this action.";
            else if (result.error.code === 50007)
              reply = "I can't DM you. Please allow direct messages from guild users.";
            else if (result.error.code === 403 || result.error.code === 50013)
              reply = "I don't have permission to do that.";
            else if (result.error.code === 50034)
              reply = "Discord doesn't allow bulk deletion of messages that are more than two weeks old.";
            else if (result.error.code > 499 && result.error.code < 600)
              reply = "An unexpected error has occurred, please try again later.";
            else if (result.error.message.indexOf("Request timed out (>15000ms)") === 0)
              reply = "The request has timed out, please try again later.";
            else
              Logger.error(result.error);
          } else {
            Logger.error(result.error);
            reply = result.error.message;
          }
        } else if (result.commandError === CommandError.BotPermission)
          reply = "I don't have permission to do that.";
        else if (result.commandError === CommandError.MemberPermission)
          reply = "You don't have permission to do that.";
        else if (result.commandError === CommandError.InvalidArgCount)
          reply = `you did this incorrectly.\n**Usage:** \`${me.config.prefix}${result.command.getUsage()}\`\n**Example:** \`${me.config.prefix}${result.command.getExample()}\``;
        else if (result.commandError === CommandError.Precondition ||
              result.commandError === CommandError.TypeReader)
          reply = result.errorReason;
        else {
          Logger.error(result.error);
          reply = result.error.message;
        }

        await message.create(msg.channel, reply, "error");
      }
    } catch (e) {
      Logger.error(e);
    }
  });
};
