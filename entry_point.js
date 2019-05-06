#!/usr/bin/env node
const COMMANDS = require('./commands');
const dev = require(COMMANDS.DEV.file);
const pr = require(COMMANDS.PR.file);
const init = require(COMMANDS.INIT.file);

(async () => {
  const command = process.argv[2];
  switch (command) {
    case COMMANDS.DEV.key:
      dev();
      break;
    case COMMANDS.INIT.key:
      init();
      break;
    case COMMANDS.PR.key:
      pr();
      break;
  }
})();
