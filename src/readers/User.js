"use strict";
const {TypeReader, TypeReaderResult} = require("patron.js");
const {regexes} = require("../utilities/constants.js");

module.exports = new class UserReader extends TypeReader {
  constructor() {
    super({
      type: "user"
    });
  }

  async read(cmd, msg, arg, args, val, me) {
    let id = val.match(regexes.mention);

    if (id != null || (id = val.match(regexes.id)) != null) {
      id = id[id.length - 1];

      if (me.client.users.get(id) != null)
        return TypeReaderResult.fromSuccess(me.client.users.get(id));
    }

    if (msg.channel.guild != null) {
      const index = val.lastIndexOf("#");

      if (index === -1) {

      } else {
        let discrim = val.slice(index);
        const username = val.slice(0, index);

        if (regexes.discrim.test(discrim) === true) {
          discrim = Number(discrim);
          const member = msg.channel.guild.members.find(m => m.discriminator === discrim && m.username === username);

          if (member != null)
            return TypeReaderResult.fromSuccess(member.user);
        }
      }
    }

    return TypeReaderResult.fromError(cmd, "User not found.");
  }
}();
