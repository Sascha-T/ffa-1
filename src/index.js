"use strict";
const Eris = require("eris");
const {Handler, Library, Registry, RequireAll: requireAll} = require("patron.js");
const path = require("path");
const {Pool} = require("pg");
const {pgdatabase, pghost, pgpass, pgport, pguser, token} = require("./credentials.json");
const Logger = require("./utilities/Logger.js");
const reqAbs = dir => requireAll(path.join(__dirname, dir));

(async () => {
  const me = {
    config: require("./config.js"),
    pool: new Pool({
      database: pgdatabase,
      host: pghost,
      password: pgpass,
      port: pgport,
      user: pguser
    })
  };
  me.client = new Eris(token, me.config.clientOptions);
  me.registry = new Registry({...me.config.registryOptions, library: Library.Eris});
  me.handler = new Handler({...me.config.handlerOptions, registry: me.registry});
  me.registry.registerPreconditions(await reqAbs("./preconditions"))
  .registerTypeReaders(await reqAbs("./readers"))
  .registerGroups(await reqAbs("./groups"))
  .registerCommands(await reqAbs("./commands"));
  for(const event of await reqAbs("./events"))
    await event(me);
  await me.client.connect();
})().catch(e => Logger.error(e) && process.exit(1));
