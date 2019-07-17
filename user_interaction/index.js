const inquirer = require('inquirer');
const COMPATIBLE_PLATFORM = require('../platforms.js');
const url = require('url');
const MESSAGES = require("./messages");
const { CHOICES } = require("./choices");
const { getAllBoardColumns } = require("../trello");
const { getAllUserBoards } = require("../trello");
const { USER_DATA_KEYS } = require("../user_data");
const { getEnvValue } = require("../user_data");

const askValueQuestion = async content => (
  await inquirer.prompt(
    [
      {
        type: 'input',
        name: 'answer',
        message: content,
      }
    ]
  )
).answer;


const askUserToChooseTicket = (async backlogTickets => {
  const question = {
    type: 'list',
    name: 'ticket',
    message: 'What ticket are you developing?',
    choices: backlogTickets.map(ticket => ({
      name: `${ticket.idShort} - ${ticket.name}`,
      value: ticket,
    })),
  };
  const answer = await inquirer.prompt([question]);
  return answer.ticket;
});

const askUserForTrelloToken = (async () => {
  return askValueQuestion(MESSAGES.TRELLO_TOKEN);
});

const askUserforHisBoard = (async () => {
  const allUserBoards = await getAllUserBoards();
  const question = {
    type: 'list',
    name: 'board',
    pageSize: 10,
    message: `What board do you want to use ?

`,
    choices: allUserBoards,
  };
  return (await inquirer.prompt([question])).board;
});

const askUserforTheColumn = (async (questionWording) => {
  const allBoardLists = await getAllBoardColumns();
  const question = {
    type: 'list',
    name: 'board',
    pageSize: 10,
    message: `${questionWording}

`,
    choices: allBoardLists,
  };
  return (await inquirer.prompt([question])).board;
});

const askUserForTrelloSecret = (async () => {
  const token = await getEnvValue(USER_DATA_KEYS.TRELLO_API_KEY);
  return askValueQuestion(MESSAGES.TRELLO_SECRET(token));
});

const askUserForHisPlatform = (async () => {
  const question = {
    type: 'list',
    name: 'platform',
    message: `What platform do you use ?

`,
    choices: [
      { name: COMPATIBLE_PLATFORM.GITLAB },
      { name: COMPATIBLE_PLATFORM.GITHUB },
    ],
  };
  return (await inquirer.prompt([question])).platform;
});

const askUserForHisGithubToken = (async () => {
  return askValueQuestion(MESSAGES.GITHUB_TOKEN);
});

const askUserForHisGitlabProjectUrl = (async () => {
  return askValueQuestion(MESSAGES.GITLAB_PROJECT_URL);
});

const askUserForHisGithubProjectUrl = (async () => {
  return askValueQuestion(MESSAGES.GITHUB_PROJECT_URL);
});

const askUserforHisMainBranch = (async () => {
  return askValueQuestion(MESSAGES.MAIN_BRANCH);
});

const askUserToCreateAGitlabToken = (async projectUrl => {
  return askValueQuestion(MESSAGES.GITLAB_TOKEN(projectUrl));
});

const askUserToPressEnterToOpenLink = (async url => {
  return askValueQuestion(MESSAGES.PRESS_ENTER_TO_OPEN(url));
});

const askUserToConfirmDoingTicket = (async tickets => {
  const question = {
    type: 'list',
    name: 'ticket',
    message: 'Which ticket are you doing ?',
    choices: tickets.map(ticket => ({
      name: ticket.name,
      value: ticket,
    })),
  };
  const answer = await inquirer.prompt([question]);
  return answer.ticket;
});

const askUserToConfirmReadingCommits = (async () => {
  const question = {
    type: 'list',
    name: 'answer',
    message: 'Have you read your code to prevent PR feedback?',
    choices: [
      { name: "Yes" },
      { name: "No" },
    ],
  };
  return (await inquirer.prompt([question])).answer;
});


const askUserIfHeHasDailyColumn = (async () => {
  const question = {
    type: 'list',
    name: 'answer',
    message: 'Do you have a "Daily Backlog" column',
    choices: [
      { name: CHOICES.YES },
      { name: CHOICES.NO },
    ],
  };
  const response = (await inquirer.prompt([question])).answer;
  return response === CHOICES.YES;
});

module.exports = {
  askUserToChooseTicket,
  askUserForTrelloToken,
  askUserForTrelloSecret,
  askUserForHisPlatform,
  askUserforHisMainBranch,
  askUserForHisGithubToken,
  askUserforTheColumn,
  askUserforHisBoard,
  askUserForHisGitlabProjectUrl,
  askUserToCreateAGitlabToken,
  askUserToConfirmDoingTicket,
  askUserToConfirmReadingCommits,
  askUserForHisGithubProjectUrl,
  askUserIfHeHasDailyColumn,
};