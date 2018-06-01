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

const patron = require("patron.js");
const path = require("path");
const cli = require("./services/cli.js");
const Logger = require("./utilities/Logger.js");

async function reqAbs(dir) {
  return patron.RequireAll(path.join(__dirname, dir));
}

(async () => {
  await cli.checkLicense();
  await cli.fetchIni();

  const client = require("./services/client.js");
  const registry = require("./services/registry.js");
  registry.registerArgumentPreconditions(await reqAbs("./preconditions/argument"))
  .registerPreconditions(await reqAbs("./preconditions/command"))
  .registerTypeReaders(await reqAbs("./readers"))
  .registerGroups(await reqAbs("./groups"))
  .registerCommands(await reqAbs("./commands"));

  await reqAbs("./events");
  await client.connect();
})().catch(e => {
  Logger.error(e);
  process.exit(1);
});
