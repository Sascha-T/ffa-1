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
process.env.TZ = "utc";
console.log(require("./utilities/constants.js").licenseNotice);

const Eris = require("eris");
const patron = require("patron.js");
const path = require("path");
const cli = require("./services/cli.js");
const Logger = require("./utilities/Logger.js");
const message = require("./utilities/message.js");
const Database = require("./services/Database.js");

async function reqAbs(dir, me) {
  const req = await patron.RequireAll(path.join(__dirname, dir));

  return req.map(r => me != null && typeof r === "function" ? r(me) : r);
}

(async () => {
  await cli.checkLicense();

  const {auth, config} = await cli.fetchIni();

  const me = {
    auth,
    config,
    db: new Database({
      baseGuildId: config.guild.id,
      connection: auth.pg
    })
  };

  Logger.setup(me);
  message.init(me);
  me.client = new Eris(auth.bot.token, config.clientOptions);
  me.registry = new patron.Registry({...config.registryOptions, library: patron.Library.Eris});
  me.handler = new patron.Handler({...config.handlerOptions, registry: me.registry});
  me.registry.registerArgumentPreconditions(await reqAbs("./preconditions/argument", me))
  .registerPreconditions(await reqAbs("./preconditions/command", me))
  .registerTypeReaders(await reqAbs("./readers", me))
  .registerGroups(await reqAbs("./groups", me))
  .registerCommands(await reqAbs("./commands", me));
  const events = await reqAbs("./events");

  for (let i = 0; i < events.length; i++)
    await events[i](me);

  await me.client.connect();
})().catch(e => {
  Logger.error(e);
  process.exit(1);
});
