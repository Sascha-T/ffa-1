"use strict";
const Eris = require("eris");
const {Handler, Library, Registry, RequireAll: requireAll} = require("patron.js");
const path = require("path");
const {Pool} = require("pg");
const {clientOptions, handlerOptions, registryOptions} = require("./config.js");
const Logger = require("./utilities/Logger.js");
class FFA {
  constructor() {
    this.client = new Eris(process.env.TOKEN, clientOptions);
    this.registry = new Registry({...registryOptions, library: Library.Eris});
    this.handler = new Handler({...handlerOptions, registry: this.registry});
    this.pool = new Pool();
  }
  static async init() {
    const me = new FFA();
    me.registry.registerPreconditions(await FFA.reqAbs("./preconditions"))
    .registerTypeReaders(await FFA.reqAbs("./readers"))
    .registerGroups(await FFA.reqAbs("./groups"))
    .registerCommands(await FFA.reqAbs("./commands"));
    for(const event of await FFA.reqAbs("./src/events"))
      await event(me);
    await me.client.connect();
  }
  static reqAbs(dir) {
    return requireAll(path.join(__dirname, dir));
  }
}
FFA.init().catch(e => Logger.error(e));
