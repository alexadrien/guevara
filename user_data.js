const fs = require('fs');
const { GuevaraFileNotOkError } = require('./errors');

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

const ENCODING = 'utf8';
const ENV_FILE_NAME = "./.guevara";

const isEnvFileCreated = (async () => {
    try {
        await fs.readFileSync(ENV_FILE_NAME, { encoding: ENCODING });
    } catch {
        return false;
    }
    return true;
});

const getEnvFile = (async () => await fs.readFileSync(ENV_FILE_NAME, { encoding: ENCODING }));

const writeEnvFile = (content => fs.writeFileSync(ENV_FILE_NAME, content, { encoding: ENCODING }));

const getEnvValue = (async valueName => {
        try {
            const envFile = await getEnvFile();
            const valueLine = envFile.split(`\n`)
                .filter(line => line.indexOf(valueName) > -1)
                [0];
            return valueLine.split(`=`)[1];
        } catch (error) {
            throw new GuevaraFileNotOkError();
        }
    })
;

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

const initialFileContent = `${USER_DATA_KEYS.GITHUB_API_PROJECT_URL}=
${USER_DATA_KEYS.GITHUB_ACCESS_TOKEN}=
${USER_DATA_KEYS.MAIN_BRANCH}=
${USER_DATA_KEYS.GITLAB_API_TOKEN}=
${USER_DATA_KEYS.GITLAB_API_PROJECT_URL}=
${USER_DATA_KEYS.TRELLO_SPRINT_COLUMN}=
${USER_DATA_KEYS.TRELLO_DAILY_COLUMN}=
${USER_DATA_KEYS.TRELLO_DOING_COLUMN}=
${USER_DATA_KEYS.TRELLO_MEMBER_ID}=
${USER_DATA_KEYS.TRELLO_BOARD_ID}=
${USER_DATA_KEYS.TRELLO_API_KEY}=
${USER_DATA_KEYS.TRELLO_API_SECRET}=`;

module.exports = {
    initialFileContent,
    isEnvFileCreated,
    getEnvFile,
    writeEnvFile,
    getEnvValue,
    writeEnvValue,
    USER_DATA_KEYS,
};