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

function parseNumbers(ini) {
  const obj = {...ini};

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop) === false || typeof obj[prop] === "boolean")
      continue;

    if (Array.isArray(obj[prop]) === true) {
      obj[prop] = obj[prop].map(i => {
        if (typeof i === "boolean")
          return i;

        if (typeof i !== "string")
          return parseNumbers(i);

        const number = Number(i);

        if (Number.isNaN(number) === false && number <= Number.MAX_SAFE_INTEGER)
          return number;

        return i;
      });
    } else if (typeof obj[prop] === "string") {
      const number = Number(obj[prop]);

      if (Number.isNaN(number) === false && number <= Number.MAX_SAFE_INTEGER)
        obj[prop] = number;
    } else
      obj[prop] = parseNumbers(obj[prop]);
  }

  return obj;
}

async function parse(bool, dir, files, file) {
  if (bool === false && files.indexOf(file) !== -1)
    return parseNumbers(ini.parse(await readFile(path.join(dir, file), "utf8")));

  return bool;
}

module.exports = {
  auth: false,

  async checkLicense() {
    if (argv.license === true) {
      console.clear();
      console.log(await readFile(path.join(__dirname, "../../LICENSE"), "utf8"));
      process.exit(0);
    }
  },

  config: false,

  async fetchIni() {
    if (this.auth === false || this.config === false) {
      let files;

      if (argv.auth != null)
        this.auth = argv.auth;

      if (argv.config != null)
        this.config = argv.config;

      if (this.auth === false || this.config === false) {
        const dir = path.join(__dirname, "../../");
        files = await readDir(dir);
        this.auth = await parse(this.auth, dir, files, "ffaAuth.ini");
        this.config = await parse(this.config, dir, files, "ffa.ini");

        if (this.auth === false || this.config === false) {
          files = await readDir(homedir);
          this.auth = await parse(this.auth, homedir, files, "ffaAuth.ini");
          this.config = await parse(this.config, homedir, files, "ffa.ini");

          if (this.auth === false) {
            console.error("Unable to locate ffaAuth.ini. Please double-check that it's in the working directory, your home directory, or the --auth argument.");
            process.exit(1);
          } else if (this.config === false) {
            console.error("Unable to locate ffa.ini. Please double-check that it's in the working directory, your home directory, or the --config argument.");
            process.exit(1);
          }
        }
      }
    }

    return {auth: this.auth, config: this.config};
  }
};
