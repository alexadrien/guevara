const { USER_DATA_KEYS } = require("./user_data");
const { getEnvValue } = require("./user_data");
const { createPullRequestOnGitlab } = require("./gitlab");
const { createPullRequestOnGithub } = require("./github");

const createPullRequest = (async ticket => {
  if (!(await getEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN))) {
    return await createPullRequestOnGitlab(ticket);
  } else if (!(await getEnvValue(USER_DATA_KEYS.GITHUB_ACCESS_TOKEN))) {
    return await createPullRequestOnGithub(ticket);
  }
});

const getPullRequestTemplate = (ticket => {
  return `
### Ticket
[${ticket.name}](${ticket.url})
  
### Screenshots
| description |
|----------|
| image |
  `;
});

module.exports = {
  createPullRequest,
  getPullRequestTemplate,
};