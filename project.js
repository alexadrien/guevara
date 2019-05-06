const child_process = require('child-process-promise');

const prepareProjectForTheNewFeature = async ticket => {
  const branchToCreate = `feature${ticket.url.replace(ticket.shortUrl, '')}`;
  const result = await child_process.exec(`git stash && git checkout -B ${branchToCreate}`);
};

const getProjectActiveBranch = async () => {
  const activeBranchCommand = await child_process.exec(`git rev-parse --abbrev-ref HEAD`);
  return activeBranchCommand.stdout.replace(/\n/g, "");
};

module.exports = {
  prepareProjectForTheNewFeature,
  getProjectActiveBranch,
};