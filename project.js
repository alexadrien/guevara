const child_process = require('child-process-promise');

const prepareProjectForTheNewFeature = async ticket => {
  const branchToCreate = `feature${ticket.url.replace(ticket.shortUrl, '')}`;
  const command = `git stash && git checkout -B ${branchToCreate}`;
  console.log(`
  Running : ${command}
  `);
  const result = await child_process.exec(command);
};

const getProjectActiveBranch = async () => {
  const activeBranchCommand = await child_process.exec(`git rev-parse --abbrev-ref HEAD`);
  return activeBranchCommand.stdout.replace(/\n/g, "");
};

module.exports = {
  prepareProjectForTheNewFeature,
  getProjectActiveBranch,
};