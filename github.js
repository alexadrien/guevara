const { getProjectActiveBranch } = require("./project");
const axios = require('axios');
const { getPullRequestTemplateDescription } = require("./pull_request");
const { USER_DATA_KEYS } = require("./user_data");
const { getEnvValue } = require("./user_data");
const { findProjectLabel } = require("./url_utils");

const getPullRequest = async () => {
  const githubApiUrl = await getEnvValue(USER_DATA_KEYS.GITHUB_API_PROJECT_URL);
  const githubToken = await getEnvValue(USER_DATA_KEYS.GITHUB_ACCESS_TOKEN);
  const activeBranch = await getProjectActiveBranch();
  return await axios.get(
    `${githubApiUrl}/pulls?access_token=${githubToken}&state=open&head=${encodeURIComponent(activeBranch)}`,
  )
    .then(response => response.data[0]);
};

const createPullRequestOnGithub = async ticket => {
  const masterBranch = await getEnvValue(USER_DATA_KEYS.MAIN_BRANCH);
  const payload = {
    title: ticket.name,
    body: getPullRequestTemplateDescription(ticket),
    head: (await getProjectActiveBranch()),
    base: masterBranch
  };

  const githubApiUrl = await getEnvValue(USER_DATA_KEYS.GITHUB_API_PROJECT_URL);
  const githubToken = await getEnvValue(USER_DATA_KEYS.GITHUB_ACCESS_TOKEN);
  const pullRequest = await axios.post(
    `${githubApiUrl}/pulls?access_token=${githubToken}`,
    payload,
  )
    .then(response => response.data)
    .catch(async response => {
    if (response.response.data.errors[0].message.indexOf("pull request already exists") > -1) {
     return await getPullRequest();
    }
  });
  return pullRequest;
};

const getGithubAPIUrl = (async (projectUrl) => {
  return `https://api.github.com/repos/${findProjectLabel(projectUrl)}`;
});

module.exports = {
  createPullRequestOnGithub,
  getGithubAPIUrl,
};