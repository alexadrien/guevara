const opn = require('opn');
const { USER_DATA_KEYS } = require("./user_data");
const { getEnvValue } = require("./user_data");

const openInNewTab = (async url => {
  await opn(url, { wait: false });
});

const openPullRequestInNewTab = (async pullRequest => {
  if (!!(await getEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN))) {
    await openInNewTab(pullRequest.web_url);
  } else if (!!(await getEnvValue(USER_DATA_KEYS.GITHUB_ACCESS_TOKEN))) {
    await openInNewTab(pullRequest.html_url);
  }
});

module.exports = {
  openPullRequestInNewTab,
  openInNewTab,
};