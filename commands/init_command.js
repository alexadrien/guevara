const {
  askUserForHisPlatform,
  askUserForTrelloSecret,
  askUserForTrelloToken,
  askUserForHisGitlabProjectUrl,
  askUserForHisGithubToken
} = require("../user_interaction");
const COMPATIBLE_PLATFORM = require('../platforms');
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

module.exports = (async () => {
  if (!await isEnvFileCreated()) {
    await writeEnvFile(initialFileContent);
  }

  if (!(await getEnvValue(USER_DATA_KEYS.TRELLO_API_KEY))) {
    const trelloToken = await askUserForTrelloToken() || await getEnvValue(USER_DATA_KEYS.TRELLO_API_KEY);
    await writeEnvValue(USER_DATA_KEYS.TRELLO_API_KEY, trelloToken);
  }

  if (!(await getEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET))) {
    const trelloSecret = await askUserForTrelloSecret() || await getEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET);
    await writeEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET, trelloSecret);
  }

  if (!(await getEnvValue(USER_DATA_KEYS.TRELLO_BOARD_ID))) {
    const boardId = await askUserforHisBoard();
    await writeEnvValue(USER_DATA_KEYS.TRELLO_BOARD_ID, boardId);
  }

  if (!(await getEnvValue(USER_DATA_KEYS.TRELLO_SPRINT_COLUMN))) {
    const sprintBacklogColumnId = await askUserforTheColumn("Please select the Sprint Backlog column ?");
    await writeEnvValue(USER_DATA_KEYS.TRELLO_SPRINT_COLUMN, sprintBacklogColumnId);
  }

  if (!(await getEnvValue(USER_DATA_KEYS.TRELLO_DAILY_COLUMN))) {
    const dailyBacklogColumnId = await askUserforTheColumn("Please select the Daily Backlog column ?");
    await writeEnvValue(USER_DATA_KEYS.TRELLO_DAILY_COLUMN, dailyBacklogColumnId);
  }

  if (!(await getEnvValue(USER_DATA_KEYS.TRELLO_DOING_COLUMN))) {
    const doingColumnId = await askUserforTheColumn("Please select the Doing column ?");
    await writeEnvValue(USER_DATA_KEYS.TRELLO_DOING_COLUMN, doingColumnId);
  }

  if (!(await getEnvValue(USER_DATA_KEYS.TRELLO_MEMBER_ID))) {
    const userMemberId = await getUserMemberId();
    await writeEnvValue(USER_DATA_KEYS.TRELLO_MEMBER_ID, userMemberId);
  }

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