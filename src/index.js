"use strict";
const fs = require("fs");
const {argv} = require("yargs").options({
  auth: {
    alias: "a",
    coerce: arg => fs.readFileSync(arg, "utf8"),
    desc: "Authentication file using the ini format.",
    example: "./ffaAuth.ini",
    normalize: true,
    type: "string"
  },
  config: {
    alias: "c",
    coerce: arg => fs.readFileSync(arg, "utf8"),
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
const {parse} = require("ini");
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

(async () => {
  let auth = false;
  let config = false;
  let files;

  if (argv.auth != null)
    auth = parse(argv.auth);

  if (argv.config != null)
    config = parse(argv.config);

  if (auth === false || config === false)
    files = await readDir("./");

  if (auth === false && files.indexOf("ffaAuth.ini") !== -1)
    auth = parse(await readFile("./ffaAuth.ini", "utf8"));

  if (config === false && files.indexOf("ffa.ini") !== -1)
    config = parse(await readFile("./ffa.ini", "utf8"));

  if (auth === false || config === false) {
    files = await readDir(homedir());

    if (auth === false && files.indexOf("ffaAuth.ini") !== -1)
      auth = parse(await readFile(path.join(homedir(), "./ffaAuth.ini"), "utf8"));

    if (config === false && files.indexOf("ffa.ini") !== -1)
      config = parse(await readFile(path.join(homedir(), "./ffa.ini"), "utf8"));
  }

  if (auth === false || config == false) {
    /* eslint-disable-next-line no-console */
    console.error("Unable to locate ffa.ini or ffaAuth.ini file. Please put them in either the working directory or your home directory.");
    process.exit(1);
  }

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
