const child_process = require('child-process-promise');

const getBranchNameFromTicket = ticket => ticket.url
  .replace(ticket.shortUrl, '')
  .split('-')[0];

const prepareProjectForTheNewFeature = async ticket => {
  const branchToCreate = `feature${getBranchNameFromTicket(ticket)}`;
  const command = `git checkout -B ${branchToCreate}`;
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