const opn = require('opn');
const { getGithubAPIProjectUrl, getGitlabAPIProjectUrl } = require("./user_data");
module.exports = {
  openPullRequestInNewTab: (async pullRequest => {
    if (!!getGithubAPIProjectUrl()) {
      await openInNewTab(pullRequest.html_url);
    } else if (!!getGitlabAPIProjectUrl()) {
      await openInNewTab(pullRequest.web_url);
    }
  }),
  openInNewTab: (async url => {
    await opn(url, { wait: false });
  }),
};