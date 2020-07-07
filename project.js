const { USER_DATA_KEYS } = require("./user_data");
const { getEnvValue } = require("./user_data");
const child_process = require("child-process-promise");

const getBranchNameFromTicket = (ticket) =>
  ticket.url.replace(ticket.shortUrl, "").split("-")[0];

const prepareProjectForTheNewFeature = async (ticket) => {
  const branchToCreate = `feature${getBranchNameFromTicket(ticket)}`;
  const command = `git checkout -B ${branchToCreate}`;
  console.log(`
  Running : ${command}
  `);
  const result = await child_process.exec(command);
};

const checkoutToDefaultBranch = async () => {
  const defaultBranchName = await getEnvValue(USER_DATA_KEYS.MAIN_BRANCH);
  const command = `git checkout ${defaultBranchName}`;
  console.log(`
  Running : ${command}
  `);
  const result = await child_process.exec(command);
};

const getProjectActiveBranch = async () => {
  const activeBranchCommand = await child_process.exec(
    `git rev-parse --abbrev-ref HEAD`
  );
  return activeBranchCommand.stdout.replace(/\n/g, "");
};

module.exports = {
  prepareProjectForTheNewFeature,
  getProjectActiveBranch,
  checkoutToDefaultBranch,
};
