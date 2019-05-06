const { getProjectActiveBranch } = require("./project");
const { getPullRequestTemplate } = require("./pull_request");
const axios = require('axios');
const { findProjectLabel } = require("./url_utils");
const { getGithubAccessToken } = require("./user_data");
const { getGithubAPIProjectUrl } = require("./user_data");

const createPullRequestOnGithub = async ticket => {
  const payload = {
    title: ticket.name,
    body: getPullRequestTemplate(ticket),
    head: (await getProjectActiveBranch()),
    base: "master"
  };

  const pullRequest = await axios.post(
    `${getGithubAPIProjectUrl()}/pulls?access_token=${getGithubAccessToken()}`,
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