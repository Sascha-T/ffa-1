"use strict";
const fs = require("fs");
const path = require("path");
const util = require("util");
const {logsDirectory} = require("../config.js");
const appendFile = util.promisify(fs.appendFile);

module.exports = new class Logger {
  constructor() {
    this.colors = {
      DEBUG: "\x1b[35m",
      ERROR: "\x1b[31m",
      INFO: "\x1b[32m",
      WARN: "\x1b[33m"
    };
    this.logsPath = path.join(__dirname, `../../${logsDirectory}`);
    try {
      fs.mkdirSync(this.logsPath);
    }catch(e) {}
    const date = new Date();
    this.day = date.getUTCDate();
    this.dateStr = this.formatDate(date);
    this.stream = fs.createWriteStream(`${this.logsPath}/${this.dateStr}`, {flags: "a"});
  }
  async log(level, msg) {
    const date = new Date();

    if(date.getUTCDate() !== this.day) {
      this.day = date.getUTCDate();
      this.dateStr = this.formatDate(this.date);
      this.stream = fs.createWriteStream(`${this.logsPath}/${this.dateStr}`, {flags: "a"});
    }

    if(this.stream.writable === false)
      await this.waitTillWritable();
    /* eslint-disable-next-line no-console */
    console[level.toLowerCase()](`${this.formatDate(date)} ${this.colors[level]}[${level}]\x1b[0m ${msg}`);
    const formattedMsg = `${this.dateStr} [${level}] ${msg}\n`;
    this.stream.write(formattedMsg);
    if(level === "ERROR")
      await appendFile(`${this.logsPath}/${this.dateStr}-Errors`, formattedMsg);
  }

  debug(msg) {
    this.log("DEBUG", msg);
  }

  info(msg) {
    this.log("INFO", msg);
  }

  warn(msg) {
    this.log("WARN", msg);
  }

  error(err) {
    this.log("ERROR", util.inspect(err, {depth: null}));
  }

  formatDate(date) {
    return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  }

  waitTillWritable() {
    return new Promise(res => {
      this.stream.on("open", () => res());
    });
  }
}();
