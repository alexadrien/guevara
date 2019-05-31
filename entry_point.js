#!/usr/bin/env node
const COMMANDS = require('./commands');
const dev = require(COMMANDS.DEV.file);
const pr = require(COMMANDS.PR.file);
const init = require(COMMANDS.INIT.file);
const help = require(COMMANDS.HELP.file);

(async () => {
  const command = process.argv[2];
  const fullCommand = process.argv.join(' ');
  if (fullCommand.includes("-h")
    || fullCommand.includes("--help")
    || fullCommand.includes("-help")
    || fullCommand.includes("help")) {
    help();
    return;
  }
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
    default:
      help();
      break;
  }
})();
