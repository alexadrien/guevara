const { getProjectActiveBranch } = require("./project");
const { getPullRequestTemplate } = require("./pull_request");
const axios = require('axios');
const { USER_DATA_KEYS } = require("./user_data");
const { getEnvValue } = require("./user_data");
const { findProjectLabel } = require("./url_utils");
const { getGithubAccessToken } = require("./user_data");
const { getGithubAPIProjectUrl } = require("./user_data");

const createPullRequestOnGithub = async ticket => {
  const masterBranch = await getEnvValue(USER_DATA_KEYS.MAIN_BRANCH);
  const payload = {
    title: ticket.name,
    body: getPullRequestTemplate(ticket),
    head: (await getProjectActiveBranch()),
    base: masterBranch
  };

  const githubApiUrl = await getEnvValue(USER_DATA_KEYS.GITHUB_API_PROJECT_URL);
  const githubToken = await getEnvValue(USER_DATA_KEYS.GITHUB_ACCESS_TOKEN);
  const pullRequest = await axios.post(
    `${githubApiUrl}/pulls?access_token=${githubToken}`,
    payload,
  );
  return pullRequest.data;
};

const getGithubAPIUrl = (async (projectUrl) => {
  return `https://api.github.com/repos/${findProjectLabel(projectUrl)}`;
});

module.exports = {
  createPullRequestOnGithub,
  getGithubAPIUrl,
};