/**
 * FFA - The core control of the free-for-all discord server.
 * Copyright (c) 2018 FFA contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";
const fs = require("fs");
const {parse} = require("ini");
/* eslint-disable-next-line no-console */
console.log(require("./utilities/constants.js").licenseNotice);
const {argv} = require("yargs").options({
  auth: {
    alias: "a",
    coerce: arg => parse(fs.readFileSync(arg, "utf8")),
    desc: "Authentication file using the ini format.",
    example: "./ffaAuth.ini",
    normalize: true,
    type: "string"
  },
  config: {
    alias: "c",
    coerce: arg => parse(fs.readFileSync(arg, "utf8")),
    desc: "Configuration file using the ini format.",
    example: "./ffa.ini",
    normalize: true,
    type: "string"
  }
}).epilogue("For more information see: https://github.com/LJNeon/ffa")
.help("help", "Show this help message.").alias("help", "h")
.version().describe("version", "Show the version number.").alias("version", "v");
const Eris = require("eris");
const {Handler, Library, Registry, RequireAll: requireAll} = require("patron.js");
const {homedir} = require("os");
const path = require("path");
const util = require("util");
const Logger = require("./utilities/Logger.js");
const message = require("./utilities/message.js");
const PGDatabase = require("./database/PGDatabase.js");
const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const reqAbs = async (dir, me) => {
  return (await requireAll(path.join(__dirname, dir))).map(r => me != null && typeof r === "function" ? r(me) : r);
};
const tryFetchIni = async () => {
  let files;
  let result = {auth: false, config: false};

  if (argv.auth != null)
    result.auth = argv.auth;

  if (argv.config != null)
    result.config = argv.config;

  if (result.auth === false || result.config === false) {
    files = await readDir("./");
    result.auth = await tryParse(result.auth, __dirname, files, "./ffaAuth.ini");
    result.config = await tryParse(result.config, __dirname, files, "./ffa.ini");

    if (result.auth === false || result.config === false) {
      files = await readDir(homedir());
      result.auth = await tryParse(result.auth, homedir(), files, "./ffaAuth.ini");
      result.config = await tryParse(result.config, homedir(), files, "./ffa.ini");

      if (result.auth === false || result.config == false) {
        /* eslint-disable-next-line no-console */
        console.error("Unable to locate ffa.ini or ffaAuth.ini file. Please put them in either the working directory or your home directory.");
        process.exit(1);
      }
    }
  }

  return result;
};
const tryParse = async (bool, dir, files, file) => {
  if (bool === false && files.indexOf(file) !== -1)
    return parse(await readFile(path.join(dir, file), "utf8"));

  return false;
};

(async () => {
  let {auth, config} = await tryFetchIni();
  const me = {
    auth,
    config,
    db: new PGDatabase({
      baseGuildId: config.guild.id,
      connection: auth.pg
    })
  };

  Logger.setup(me);
  message.init(me);
  me.client = new Eris(auth.bot.token, config.clientOptions);
  me.registry = new Registry({...config.registryOptions, library: Library.Eris});
  me.handler = new Handler({...config.handlerOptions, registry: me.registry});
  me.registry.registerArgumentPreconditions(await reqAbs("./preconditions/argument", me))
  .registerPreconditions(await reqAbs("./preconditions/command", me))
  .registerTypeReaders(await reqAbs("./readers", me))
  .registerGroups(await reqAbs("./groups", me))
  .registerCommands(await reqAbs("./commands", me));

  for (const event of await reqAbs("./events"))
    await event(me);

  await me.client.connect();
})().catch(e => {
  Logger.error(e);
  process.exit(1);
});
