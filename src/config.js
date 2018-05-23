"use strict";
module.exports = new class Config {
  constructor() {
    // Bot config
    this.clientOptions = {
      compress: true,
      defaultImageFormat: "png",
      defaultImageSize: 1024,
      disableEvents: {
        TYPING_START: true,
        VOICE_STATE_UPDATE: true
      },
      getAllUsers: true,
      latencyThreshold: 1e3
    };
    this.handlerOptions = {};
    this.registryOptions = {
      caseSensitive: false
    };

    // Command handler
    this.prefix = ";";

    // Current user
    this.game = `${this.prefix}help`;

    // Guild
    this.invite = "https://discord.gg/F7reg7e";
    this.helpMsg = `FFA's goal is to provide a fully decentralized discord server by allowing the community to control\
 every aspect of the guild. The entire system is based around reputation. The most reputable users are the moderators.\
 If believe a certain user is suitable to moderate, you may enter the following: \`${this.prefix}rep username#1234\`. \
The opposite can be done with \`${this.prefix}unrep\`.\n\nIt is essential that reputation remains in the right hands, \
as everything revolves around it. It is your duty as a member of this community to ensure that if a user was unjustly \
punished, the culprit must pay the consequences while vindicating the victim. You may view anyone's reputation by usin\
 \`${this.prefix}getrep\`.\n\nIf you wish to view the various command categories, you may use \`${this.prefix}modules\
\`g. To view all the commands of a module, you may use \`${this.prefix}module general\`. You may also view all command\
s by using \`${this.prefix}commands\`. If you wish to view the progress of this bot, or simply support the creators, y\
ou may join the official FFA server here: ${this.invite}.`;

    // Account age required
    this.memberAge = 1728e5;

    // Chat settings
    this.chatServiceDelay = 3e4;
    this.chatReward = 0.025;

    // Reputation decay
    this.decayMul = 0.99;

    // Moderation settings
    this.clearDeleteDelay = 3e3;

    // Spam settings
    this.spamRepPenalty = 2;
    this.spamLimit = 5;
    this.spamMuteLength = 216e5;
    this.spamDuration = 4e3;

    // Deleted messages settings
    this.deletedMessagesChars = 350;

    // Rate limit settings
    this.ignoreDuration = 18e5;

    // Reputation commands
    this.repIncrease = 1;
    this.unrepDecrease = 1;

    // Reputation requirements
    this.topRemoveEmoji = 20;
    this.topModCmd = 20;
    this.topRemoveCmd = 20;
    this.topMod = 30;
    this.topColor = 40;
    this.topAddEmoji = 40;

    // Maximums
    this.maxLb = 30;
    this.maxClear = 100;
    this.maxReasonLength = 600;
    this.maxCmdNewLines = 10;
    this.maxDeletedMsgs = 10;

    // Minimums
    this.minLb = 5;
    this.minClear = 3;
    this.minDeletedMsgs = 1;
    this.minMuteLength = 1;

    // Defaults
    this.clearDefault = 20;
    this.lbCount = 10;
    this.deletedMsgs = 5;

    // Cooldowns
    this.repCd = 216e5;
    this.unrepCd = 216e5;
    this.colorCd = 36e5;
    this.unmuteCd = 432e5;
    this.modCmdCd = 36e5;
    this.removeCmdCd = 36e5;
    this.addEmojiCd = 18e5;
    this.removeEmojiCd = 18e5;

    // Timers
    this.autoUnmuteTimer = 6e4;
    this.repDecayTimer = 36e5;
    this.disboardBumpTimer = 36e5;
    this.serverHoundBumptimer = 144e5;
    this.resetActionsTimer = 36e5;

    // Logs
    this.logsDirectory = "./logs/";

    // Custom colors
    this.errorColor = 0xFF0000;
    this.muteColor = 0xFF3E29;
    this.unmuteColor = 0x72FF65;
    this.clearColor = 0x4D3DFF;

    // Default colors
    this.colors = [0xFF269A, 0x66FFCC, 0x00FF00, 0xB10DC9, 0x00E828, 0xFFFF00, 0x08F8FF, 0x03FFAB, 0xF226FF, 0xFF00BB,
      0xFF1C8E, 0x00FFFF, 0x68FF22, 0x14DEA0, 0xFFBE11, 0x0FFFFF, 0x2954FF, 0x40E0D0, 0x9624ED, 0x01ADB0,
      0xA8ED00, 0xBF255F];
  }
}();
