const { USER_DATA_KEYS } = require("./user_data");
const { createPullRequestOnGithub } = require("./github");
const { createPullRequestOnGitlab } = require("./gitlab");
const { getEnvValue } = require("./user_data");
const { checkoutToDefaultBranch } = require("./project");

const createPullRequest = async (ticket) => {
  let retRequest = null;
  if (!!(await getEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN))) {
    retRequest = await createPullRequestOnGitlab(ticket);
  } else if (!!(await getEnvValue(USER_DATA_KEYS.GITHUB_ACCESS_TOKEN))) {
    retRequest = await createPullRequestOnGithub(ticket);
  }
  await checkoutToDefaultBranch();
  return retRequest;
};

module.exports = {
  createPullRequest,
};
