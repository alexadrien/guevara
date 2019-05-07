const { USER_DATA_KEYS } = require("./user_data");
const { createPullRequestOnGithub } = require("./github");
const { createPullRequestOnGitlab } = require("./gitlab");
const { getEnvValue } = require("./user_data");

const createPullRequest = (async ticket => {
  if (!!(await getEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN))) {
    return await createPullRequestOnGitlab(ticket);
  } else if (!!(await getEnvValue(USER_DATA_KEYS.GITHUB_ACCESS_TOKEN))) {
    return await createPullRequestOnGithub(ticket);
  }
});

module.exports = {
  createPullRequest,
};