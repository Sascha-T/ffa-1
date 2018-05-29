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
const homedir = require("os").homedir();
const ini = require("ini");
const path = require("path");
const util = require("util");
const {argv} = require("yargs").options({
  auth: {
    alias: "a",
    coerce: arg => ini.parse(fs.readFileSync(path.join(__dirname, `../${arg}`), "utf8")),
    desc: "Authentication file using the ini format.",
    example: "./ffaAuth.ini",
    type: "string"
  },
  config: {
    alias: "c",
    coerce: arg => ini.parse(fs.readFileSync(path.join(__dirname, `../${arg}`), "utf8")),
    desc: "Configuration file using the ini format.",
    example: "./ffa.ini",
    type: "string"
  },
  license: {
    alias: "l",
    desc: "Show the license.",
    type: "boolean"
  }
}).epilogue("For more information see: https://github.com/LJNeon/ffa")
.help("help", "Show this help message.").alias("help", "h")
.version().describe("version", "Show the version number.").alias("version", "v");
const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

async function parse(bool, dir, files, file) {
  if (bool === false && files.indexOf(file) !== -1)
    return ini.parse(await readFile(path.join(dir, file), "utf8"));

  return bool;
}

module.exports = {
  checkLicense: async () => {
    if (argv.license === true) {
      console.clear();
      console.log(await readFile(path.join(__dirname, "../LICENSE"), "utf8"));
      process.exit(0);
    }
  },

  fetchIni: async () => {
    let files;
    const result = {auth: false, config: false};

    if (argv.auth != null)
      result.auth = argv.auth;

    if (argv.config != null)
      result.config = argv.config;

    if (result.auth === false || result.config === false) {
      const dir = path.join(__dirname, "../");
      files = await readDir(dir);
      result.auth = await parse(result.auth, dir, files, "ffaAuth.ini");
      result.config = await parse(result.config, dir, files, "ffa.ini");

      if (result.auth === false || result.config === false) {
        files = await readDir(homedir);
        result.auth = await parse(result.auth, homedir, files, "ffaAuth.ini");
        result.config = await parse(result.config, homedir, files, "ffa.ini");

        if (result.auth === false) {
          /* eslint-disable-next-line no-console */
          console.error("Unable to locate ffaAuth.ini. Please double-check that it's in the working directory, your home directory, or the --auth argument.");
          process.exit(1);
        } else if (result.config === false) {
          /* eslint-disable-next-line no-console */
          console.error("Unable to locate ffa.ini. Please double-check that it's in the working directory, your home directory, or the --config argument.");
          process.exit(1);
        }
      }
    }

    return result;
  }
};
