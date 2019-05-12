const { sendInitCommand } = require("../analytics");
const {
  askUserForHisPlatform,
  askUserForTrelloSecret,
  askUserForTrelloToken,
  askUserForHisGitlabProjectUrl,
  askUserForHisGithubToken
} = require("../user_interaction");
const COMPATIBLE_PLATFORM = require('../platforms');
const { CHOICES } = require("../user_interaction/choices");
const { askUserIfHeHasDailyColumn } = require("../user_interaction");
const { askUserToCreateAGitlabToken } = require("../user_interaction");
const { askUserforHisMainBranch } = require("../user_interaction");
const { getUserMemberId } = require("../trello");
const { askUserforTheColumn } = require("../user_interaction");
const { getEnvValue } = require("../user_data");
const { askUserforHisBoard } = require("../user_interaction");
const { getGithubAPIUrl } = require("../github");
const { askUserForHisGithubProjectUrl } = require("../user_interaction");
const {
  initialFileContent,
  writeEnvFile,
  isEnvFileCreated,
  writeEnvValue,
  USER_DATA_KEYS,
} = require("../user_data");
const { getGitlabAPIUrl } = require("../gitlab");

const getValueIfNotExisting = async (valueKey, functionToGetValue) => {
  if (!(await getEnvValue(valueKey))) {
    const value = await functionToGetValue();
    await writeEnvValue(valueKey, value);
  }
};

module.exports = (async () => {
  sendInitCommand();
  if (!await isEnvFileCreated()) {
    await writeEnvFile(initialFileContent);
  }

  await getValueIfNotExisting(
    USER_DATA_KEYS.TRELLO_API_KEY,
    async () => (await askUserForTrelloToken() || await getEnvValue(USER_DATA_KEYS.TRELLO_API_KEY)),
  );

  await getValueIfNotExisting(
    USER_DATA_KEYS.TRELLO_API_SECRET,
    async () => (await askUserForTrelloSecret() || await getEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET)),
  );

  await getValueIfNotExisting(
    USER_DATA_KEYS.TRELLO_BOARD_ID,
    async () => (await askUserforHisBoard()),
  );

  await getValueIfNotExisting(
    USER_DATA_KEYS.TRELLO_SPRINT_COLUMN,
    async () => (await askUserforTheColumn("Please select the Sprint Backlog column ?")),
  );

  await getValueIfNotExisting(
    USER_DATA_KEYS.TRELLO_DAILY_COLUMN,
    async () => {
      const userHasDailyColumn = await askUserIfHeHasDailyColumn();
      if (userHasDailyColumn) {
        return await askUserforTheColumn("Please select the Daily Backlog column ?")
      }
      return CHOICES.NO;
    },
  );

  await getValueIfNotExisting(
    USER_DATA_KEYS.TRELLO_DOING_COLUMN,
    async () => (await askUserforTheColumn("Please select the Doing column ?")),
  );

  await getValueIfNotExisting(
    USER_DATA_KEYS.TRELLO_MEMBER_ID,
    async () => (await getUserMemberId()),
  );

  let platform = null;
  const userHasGitlab = !!await getEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN);
  const userHasGithub = !!await getEnvValue(USER_DATA_KEYS.GITHUB_ACCESS_TOKEN);
  if (!userHasGithub && !userHasGitlab) {
    platform = await askUserForHisPlatform();
  } else {
    switch (true) {
      case userHasGithub && !userHasGithub:
        platform = COMPATIBLE_PLATFORM.GITHUB;
        break;
      case !userHasGithub && userHasGithub:
        platform = COMPATIBLE_PLATFORM.GITLAB;
        break;
    }
  }

  switch (true) {
    case platform === COMPATIBLE_PLATFORM.GITHUB:
      if (!(await getEnvValue(USER_DATA_KEYS.GITHUB_ACCESS_TOKEN))) {
        const githubToken = await askUserForHisGithubToken();
        await writeEnvValue(USER_DATA_KEYS.GITHUB_ACCESS_TOKEN, githubToken);
      }

      if (!(await getEnvValue(USER_DATA_KEYS.GITHUB_API_PROJECT_URL))) {
        const githubProjectUrl = await askUserForHisGithubProjectUrl();
        if (githubProjectUrl) {
          const githubAPIProjectUrl = await getGithubAPIUrl(githubProjectUrl);
          await writeEnvValue(USER_DATA_KEYS.GITHUB_API_PROJECT_URL, githubAPIProjectUrl);
        }
      }

      break;
    case platform === COMPATIBLE_PLATFORM.GITLAB:
      let gitlabUrl;
      if (!(await getEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN))) {
        gitlabUrl = await askUserForHisGitlabProjectUrl();
        const gitlabToken = await askUserToCreateAGitlabToken(gitlabUrl) || await getEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN);
        await writeEnvValue(USER_DATA_KEYS.GITLAB_API_TOKEN, gitlabToken);
      }

      if (!(await getEnvValue(USER_DATA_KEYS.GITLAB_API_PROJECT_URL))) {
        if (!gitlabUrl) {
          gitlabUrl = await askUserForHisGitlabProjectUrl();
        }
        const gitlabApiProjectUrl = await getGitlabAPIUrl(gitlabUrl);
        await writeEnvValue(USER_DATA_KEYS.GITLAB_API_PROJECT_URL, gitlabApiProjectUrl);
      }

      break;
    default:
      break;
  }

  if (!await getEnvValue(USER_DATA_KEYS.MAIN_BRANCH)) {
    const mainBranch = await askUserforHisMainBranch();
    await writeEnvValue(USER_DATA_KEYS.MAIN_BRANCH, mainBranch);
  }

  console.log("✅ Ready to code ! 💪");
});