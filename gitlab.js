const child_process = require('child-process-promise');
const { getProjectActiveBranch } = require("./project");
const axios = require('axios');
const { getGitlabApiToken } = require("./user_data");
const { getGithubAPIProjectUrl } = require("./user_data");
const { getMainBranch } = require("./user_data");
const { getPullRequestTemplate } = require("./pull_request");
const url = require('url');
const { findProjectTitle } = require("./url_utils");
const { findProjectLabel } = require("./url_utils");
const { USER_DATA_KEYS } = require("./user_data");
const { getEnvValue } = require("./user_data");

const getPullRequest = (async id => {
  const gitlabAPIUrl = getEnvValue(USER_DATA_KEYS.GITLAB_API_PROJECT_URL);
  const gitlabToken = getEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN);
  const pullRequest = (await axios.get(
    `${gitlabAPIUrl}/merge_requests/${id}`,
    {
      headers:
        {
          'Private-Token': gitlabToken
        }
    }
  ));
  return pullRequest;
});

const getGitlabAPIUrl = (async (projectUrl) => {
  const parsedUrl = url.parse(projectUrl);
  const gitlabToken = await getEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN);
  const projectLabel = findProjectLabel(projectUrl);
  const projectTitle = findProjectTitle(projectUrl);
  return axios.get(
    `${parsedUrl.protocol}//${parsedUrl.hostname}/api/v4/search?scope=projects&search=${projectTitle}`,
    {
      headers: {
        "PRIVATE-TOKEN": gitlabToken
      }
    }
  )
    .then(res => res.data.filter(item => item.path_with_namespace === projectLabel))
    .then(project => project && project[0].id)
    .then(id => `${parsedUrl.protocol}//${parsedUrl.hostname}/api/v4/projects/${id}`);
});

const pushProject = (async () => {
  await child_process.exec(`git push --set-upstream origin ${await getProjectActiveBranch()}`);
});

const createPullRequestOnGitlab = (async ticket => {
  const payload = {
    source_branch: await getProjectActiveBranch(),
    target_branch: getMainBranch(),
    title: ticket.name,
    description: getPullRequestTemplate(ticket),
  };
  const apiUrl = await getEnvValue(USER_DATA_KEYS.GITLAB_API_PROJECT_URL);
  const gitlabToken = await getEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN);
  const pullRequest = await axios.post(
    `${apiUrl}/merge_requests`,
    payload,
    {
      headers:
        {
          'Private-Token': gitlabToken
        }
    }
  ).catch(async err => await getPullRequest(err.response.data.message[0].split('!')[1]));
  return pullRequest.data;
});

module.exports = {
  getPullRequest,
  getGitlabAPIUrl,
  pushProjectToGitlab: pushProject,
  createPullRequestOnGitlab,
};