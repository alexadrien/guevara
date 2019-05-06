const fsPromises = require('fs').promises;

const USER_DATA_KEYS = {
  GITHUB_API_PROJECT_URL: 'GithubApiProjectUrl',
  GITHUB_ACCESS_TOKEN: 'GithubAccessToken',
  MAIN_BRANCH: 'MainBranch',
  GITLAB_API_TOKEN: 'GitlabApiToken',
  GITLAB_API_PROJECT_URL: 'GitlabApiProjectUrl',
  TRELLO_SPRINT_COLUMN: 'TrelloSprintColumn',
  TRELLO_DAILY_COLUMN: 'TrelloDailyColumn',
  TRELLO_DOING_COLUMN: 'TrelloDoingColumn',
  TRELLO_MEMBER_ID: 'TrelloMemberId',
  TRELLO_BOARD_ID: 'TrelloBoardId',
  TRELLO_API_KEY: 'TrelloApiKey',
  TRELLO_API_SECRET: 'TrelloApiSecret',
};

const DUMB_VALUE = 'XXX';
const ENCODING = 'utf8';
const ENV_FILE_NAME = "./.guevara";

const isEnvFileCreated = (async () => {
  try {
    await fsPromises.readFile(ENV_FILE_NAME, { encoding: ENCODING });
  } catch {
    return false;
  }
  return true;
});

const getEnvFile = (() => fsPromises.readFile(ENV_FILE_NAME, { encoding: ENCODING }));

const writeEnvFile = (content => fsPromises.writeFile(ENV_FILE_NAME, content, { encoding: ENCODING }));

const getEnvValue = (async valueName => {
  const envFile = await getEnvFile();
  const valueLine = envFile.split(`\n`)
    .filter(line => line.indexOf(valueName) > -1);
  return valueLine.split(`=`)[1];
});

const writeEnvValue = (async (valueName, value) => {
  let envFile = await getEnvFile();
  envFile = envFile
    .split(`\n`)
    .map(line => line.split('='))
    .map(line => [line[0], line[0] === valueName ? value : line[1]])
    .map(line => line.join(`=`))
    .join('\n');
  await writeEnvFile(envFile);
});

const initialFileContent = `${USER_DATA_KEYS.GITHUB_API_PROJECT_URL}=${DUMB_VALUE}
${USER_DATA_KEYS.GITHUB_ACCESS_TOKEN}=${DUMB_VALUE}
${USER_DATA_KEYS.MAIN_BRANCH}=${DUMB_VALUE}
${USER_DATA_KEYS.GITLAB_API_TOKEN}=${DUMB_VALUE}
${USER_DATA_KEYS.GITLAB_API_PROJECT_URL}=${DUMB_VALUE}
${USER_DATA_KEYS.TRELLO_SPRINT_COLUMN}=${DUMB_VALUE}
${USER_DATA_KEYS.TRELLO_DAILY_COLUMN}=${DUMB_VALUE}
${USER_DATA_KEYS.TRELLO_DOING_COLUMN}=${DUMB_VALUE}
${USER_DATA_KEYS.TRELLO_MEMBER_ID}=${DUMB_VALUE}
${USER_DATA_KEYS.TRELLO_BOARD_ID}=${DUMB_VALUE}
${USER_DATA_KEYS.TRELLO_API_KEY}=${DUMB_VALUE}
${USER_DATA_KEYS.TRELLO_API_SECRET}=${DUMB_VALUE}`;

module.exports = {
  initialFileContent,
  isEnvFileCreated,
  getEnvFile,
  writeEnvFile,
  getEnvValue,
  writeEnvValue,
  USER_DATA_KEYS,
};