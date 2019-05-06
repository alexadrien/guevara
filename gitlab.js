const child_process = require('child-process-promise');
const { getProjectActiveBranch } = require("./project");
const axios = require('axios');
const { getGitlabApiToken } = require("./user_data");
const { getGithubAPIProjectUrl } = require("./user_data");
const { getMainBranch } = require("./user_data");
const { getPullRequestTemplate } = require("./pull_request");
const url = require('url');

const getPullRequest = (async id => {
  const pullRequest = (await axios.get(
    `${myGitlabAPIProjectUrl}/merge_requests/${id}`,
    {
      headers:
        {
          'Private-Token': myGitlabApiToken
        }
    }
  ));
  return pullRequest;
});

const getGitlabAPIUrl = (async (projectUrl, token) => {
  const parsedUrl = url.parse(projectUrl);
  const projectLabel = findProjectLabel(projectUrl);
  const projectTitle = findProjectTitle(projectUrl);
  return axios.get(
    `${parsedUrl.protocol}//${parsedUrl.hostname}/api/v4/search?scope=projects&search=${projectTitle}`,
    {
      headers: {
        "PRIVATE-TOKEN": token
      }
    }
  )
    .then(res => res.data.filter(item => item.path_with_namespace === projectLabel))
    .then(project => project && project[0].id)
    .then(id => `${parsedUrl.protocol}//${parsedUrl.hostname}/api/v4/projects/${id}`);
});

const pushProjectToGitlab = (async () => {
  const result = await child_process.exec(`git push --set-upstream origin ${await getProjectActiveBranch()}`);
});

const createPullRequestOnGitlab = (async ticket => {
  const payload = {
    source_branch: await getProjectActiveBranch(),
    target_branch: getMainBranch(),
    title: ticket.name,
    description: getPullRequestTemplate(ticket),
  };
  const pullRequest = await axios.post(
    `${getGithubAPIProjectUrl()}/merge_requests`,
    payload,
    {
      headers:
        {
          'Private-Token': getGitlabApiToken()
        }
    }
  ).catch(async err => await getPullRequest(err.response.data.message[0].split('!')[1]));
  return pullRequest.data;
});

module.exports = {
  getPullRequest,
  getGitlabAPIUrl,
  pushProjectToGitlab,
  createPullRequestOnGitlab,
};