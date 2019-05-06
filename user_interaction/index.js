const inquirer = require('inquirer');
const COMPATIBLE_PLATFORM = require('../platforms.js');
const url = require('url');
const MESSAGES = require("./messages");

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
      name: ticket.name,
      value: ticket,
    })),
  };
  const answer = await inquirer.prompt([question]);
  return answer.ticket;
});

const askUserForTrelloToken = (async () => {
  return askValueQuestion(MESSAGES.TRELLO_TOKEN);
});

const askUserForTrelloSecret = (async token => {
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

const askUserToCreateAGitlabToken = (async projectUrl => {
  return askValueQuestion(MESSAGES.GITLAB_TOKEN(projectUrl));
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

module.exports = {
  askUserToChooseTicket,
  askUserForTrelloToken,
  askUserForTrelloSecret,
  askUserForHisPlatform,
  askUserForHisGithubToken,
  askUserForHisGitlabProjectUrl,
  askUserToCreateAGitlabToken,
  askUserToConfirmDoingTicket,
  askUserToConfirmReadingCommits,
  askUserForHisGithubProjectUrl,
};