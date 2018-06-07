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
const {alphabet} = require("../utilities/constants.js");
const client = require("../services/client.js");
const Database = require("../services/Database.js");
const message = require("../utilities/message.js");
const random = require("../utilities/random.js");
const str = require("../utilities/string.js");
const time = require("../utilities/time.js");

module.exports = {
  countLetters(letters) {
    let result = -1;

    for (let i = 0; i < letters.length; i++)
      result += (alphabet.indexOf(letters.charAt(i)) + 1) * Math.pow(alphabet.length, letters.length - i - 1);

    return result;
  },

  async getCategories(guildId) {
    const query = await Database.pool.query(
      "SELECT category, content, mute_length, timestamp FROM rules WHERE id = $1 ORDER BY timestamp ASC",
      [guildId]
    );
    const rules = query.rows;

    return rules.reduce((a, b) => {
      let index = a.findIndex(c => c[0].category === b.category);

      if (index === -1) {
        index = a.length;
        a[index] = [];
      }

      a[index].push(b);

      return a;
    }, []);
  },

  letterCount(count) {
    if (count < alphabet.length)
      return alphabet[count];

    let dividend = count - 1;
    let result = "";

    while (dividend > 0) {
      const modulo = (dividend - 1) % alphabet.length;
      result = alphabet[modulo] + result;
      dividend = Math.floor((dividend - modulo) / alphabet.length);
    }

    return result;
  },

  listRules(rules) {
    return rules.map((r, i) => {
      if (r.mute_length == null)
        return `**${this.letterCount(i)}.** ${r.content} (Bannable)`;
      else
        return `**${this.letterCount(i)}.** ${r.content} (${time.format(r.mute_length)})`;
    }).join("\n");
  },

  queue: {},

  async start(guildId) {
    const query = await Database.getGuild(guildId, {channels: "rules_id"});
    const channelId = query.channels.rules_id;

    if (channelId == null)
      this.queue[guildId] = 0;
    else {
      const channel = client.getChannel(channelId);

      if (channel !== null) {
        const msgs = await channel.getMessages(100);

        for (let i = 0; i < msgs.length; i++) {
          if (msgs[i].author.id === client.user.id)
            await msgs[i].delete();
        }

        const categories = await this.getCategories(guildId);
        const colors = [...message.colors];

        for (let i = 0; i < categories.length; i++) {
          const color = random.element(colors);
          colors.splice(colors.indexOf(color), 1);

          await message.create(channel, {
            description: this.listRules(categories[i]),
            title: `${i + 1}. ${str.capitalize(categories[i][0].category)}:`
          }, color);
        }

        this.queue[guildId]--;

        if (this.queue[guildId] !== 0)
          this.start(guildId);
      }
    }
  },

  update(guildId) {
    if (this.queue.hasOwnProperty(guildId) === false || this.queue[guildId] === 0) {
      this.queue[guildId] = 1;
      this.start(guildId);
    } else if (this.queue[guildId] === 1)
      this.queue[guildId]++;
  }
};
