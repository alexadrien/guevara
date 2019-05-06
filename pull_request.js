const { getGitlabAPIProjectUrl } = require("./user_data");
const { getGithubAPIProjectUrl } = require("./user_data");
const { createPullRequestOnGitlab } = require("./gitlab");
const { createPullRequestOnGithub } = require("./github");

const createPullRequest = (async ticket => {
  if (!!getGithubAPIProjectUrl()) {
    return await createPullRequestOnGithub();
  } else if (!!getGitlabAPIProjectUrl()) {
    return await createPullRequestOnGitlab();
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