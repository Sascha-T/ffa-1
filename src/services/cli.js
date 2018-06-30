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
const path = require("path");
const yaml = require("js-yaml");
const {argv} = require("yargs").options({
  auth: {
    alias: "a",
    coerce: arg => yaml.safeLoad(fs.readFileSync(
      path.join(__dirname, `../${arg}`),
      "utf8"
    )),
    desc: "Authentication file using the yaml format.",
    example: "./ffaAuth.yml",
    type: "string"
  },
  config: {
    alias: "c",
    coerce: arg => yaml.safeLoad(fs.readFileSync(
      path.join(__dirname, `../${arg}`),
      "utf8"
    )),
    desc: "Configuration file using the yaml format.",
    example: "./ffa.yml",
    type: "string"
  },
  license: {
    alias: "l",
    desc: "Show the license.",
    type: "boolean"
  }
}).epilogue("For more information see: https://github.com/LJNeon/ffa")
  .help("help", "Show this help message.")
  .alias("help", "h")
  .version()
  .describe("version", "Show the version number.")
  .alias("version", "v");
const {data: {responses}} = require("./data.js");
const homedir = require("os").homedir();
const util = require("util");
const str = require("../utilities/string.js");
const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

async function parse(bool, dir, files, file) {
  if (bool === false && files.includes(file) === true)
    return yaml.safeLoad(await readFile(path.join(dir, file), "utf8"));

  return bool;
}

module.exports = {
  auth: false,

  async checkLicense() {
    if (argv.license === true) {
      console.clear();
      console.log(await readFile(
        path.join(__dirname, "../../LICENSE"),
        "utf8"
      ));
      process.exit(0);
    }
  },

  config: false,

  async fetch() {
    if (this.auth === false || this.config === false) {
      if (argv.auth != null)
        this.auth = argv.auth;

      if (argv.config != null)
        this.config = argv.config;

      await this.searchIfNeeded(path.join(__dirname, "../../"));
      await this.searchIfNeeded(homedir);

      if (this.auth === false || this.config === false) {
        console.error(str.format(
          responses.cantLocate,
          `ffa${this.auth === false ? "Auth" : ""}.yml`,
          `--${this.auth === false ? "auth" : "config"}`
        ));
        process.exit(1);
      }
    }
  },

  async searchIfNeeded(dir) {
    if (this.auth === false || this.config === false) {
      const files = await readDir(dir);

      this.auth = await parse(this.auth, dir, files, "ffaAuth.yml");
      this.config = await parse(this.config, dir, files, "ffa.yml");
    }
  }
};
