const {
  askUserForHisPlatform,
  askUserForTrelloSecret,
  askUserForTrelloToken,
  askUserForHisGitlabProjectUrl,
  askUserForHisGithubToken
} = require("../user_interaction");
const COMPATIBLE_PLATFORM = require('../platforms');
const { getGithubAPIUrl } = require("../github");
const { askUserForHisGithubProjectUrl } = require("../user_interaction");
const {
  initialFileContent,
  writeEnvFile,
  isEnvFileCreated,
  writeEnvValue,
  askUserToCreateAGitlabToken,
  USER_DATA_KEYS,
} = require("../user_data");
const { getGitlabAPIUrl } = require("../gitlab");

module.exports = (async () => {
  if (!await isEnvFileCreated()) {
    await writeEnvFile(initialFileContent);
  }

  const trelloToken = await askUserForTrelloToken() || "TRELLO_TOKEN";
  writeEnvValue(USER_DATA_KEYS.TRELLO_API_KEY, trelloToken);

  const trelloSecret = await askUserForTrelloSecret(trelloToken) || "TRELLO_SECRET";
  writeEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET, trelloSecret);

  const platform = await askUserForHisPlatform() || "Github" || "Gitlab";

  switch (true) {
    case platform === COMPATIBLE_PLATFORM.GITHUB:
      const githubToken = await askUserForHisGithubToken() || "GITHUB_TOKEN";
      writeEnvValue(USER_DATA_KEYS.GITHUB_ACCESS_TOKEN, githubToken);

      const githubProjectUrl = await askUserForHisGithubProjectUrl() || "https://github.com/alexadrien/myautomationscripts";
      const githubAPIProjectUrl = await getGithubAPIUrl(githubProjectUrl);
      writeEnvValue(USER_DATA_KEYS.GITHUB_API_PROJECT_URL, githubAPIProjectUrl);

      break;
    case platform === COMPATIBLE_PLATFORM.GITLAB:
      const gitlabUrl = await askUserForHisGitlabProjectUrl();
      const gitlabToken = await askUserToCreateAGitlabToken(gitlabUrl);
      writeEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN, gitlabToken)

      const gitlabApiProjectUrl = await getGitlabAPIUrl(gitlabUrl, gitlabToken);
      writeEnvValue(USER_DATA_KEYS.GITLAB_API_PROJECT_URL, gitlabApiProjectUrl);

      break;
    default:
      break;
  }
});