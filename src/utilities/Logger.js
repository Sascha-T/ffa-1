"use strict";
const fs = require("fs");
const path = require("path");
const util = require("util");
const {logColors} = require("./constants.js");
const appendFile = util.promisify(fs.appendFile);

module.exports = new class Logger {
  constructor() {
    const date = new Date();
    this.day = date.getUTCDate();
    this.dateStr = this.formatDate(date);
    this.init = false;
  }

  setup(me) {
    this.init = true;
    this.logsPath = path.join(__dirname, `../../${me.config.logsDirectory}`);

    if (fs.existsSync(this.logsPath) === false)
      fs.mkdir(this.logsPath);

    this.stream = fs.createWriteStream(`${this.logsPath}/${this.dateStr}`, {flags: "a"});
  }

  async log(level, msg) {
    if (this.init === false)
      /* eslint-disable-next-line no-console */
      return console[level.toLowerCase()]("The logger needs to be initialized before use.", msg);

    const date = new Date();

    if (date.getUTCDate() !== this.day) {
      this.day = date.getUTCDate();
      this.dateStr = this.formatDate(this.date);
      this.stream = fs.createWriteStream(`${this.logsPath}/${this.dateStr}`, {flags: "a"});
    }

    if (this.stream.writable === false)
      await this.waitTillWritable();
    /* eslint-disable-next-line no-console */
    console[level.toLowerCase()](`${this.formatDate(date)} ${logColors[level]}[${level}]\x1b[0m ${msg}`);
    const formattedMsg = `${this.dateStr} [${level}] ${msg}\n`;
    this.stream.write(formattedMsg);
    if (level === "ERROR")
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
