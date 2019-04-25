#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/.env' });
const inquirer = require('inquirer');
const axios = require('axios');
const child_process = require('child-process-promise');
const lodash = require('lodash');
const opn = require('opn');

const myTrelloApiKey = process.env.trello_api_key;
const myTrelloApiSecret = process.env.trello_api_secret;
const myTrelloBoardId = process.env.trello_board_id;
const myTrelloSprintColumn = process.env.trello_sprint_backlog_column;
const myTrelloDailyColumn = process.env.trello_daily_column;
const myTrelloDoingColumn = process.env.trello_doing_column;
const myTrelloMemberId = process.env.trello_member_id;
const myProjectPath = process.env.project_path;
const myGitlabAPIProjectUrl = process.env.gitlab_api_project_url;
const myGitlabApiToken = process.env.gitlab_api_token;
const myGithubAccessToken = process.env.github_access_token;
const myGitlabMainBranch = 'master';


const ticketIsInBacklog = ticket => {
  const acceptedColumns = [
    myTrelloSprintColumn,
    myTrelloDailyColumn,
  ];
  return lodash.indexOf(acceptedColumns, ticket.idList) > -1;
};

const ticketIsInDoing = ticket => {
  const acceptedColumns = [
    myTrelloDoingColumn,
  ];
  return lodash.indexOf(acceptedColumns, ticket.idList) > -1;
};

const ticketMemberIsMe = ticket => {
  return lodash.indexOf(ticket.idMembers, myTrelloMemberId) > -1;
};

const getBacklogTickets = async () => {
  const allCards = await axios.get(`https://api.trello.com/1/boards/${myTrelloBoardId}/cards?key=${myTrelloApiKey}&token=${myTrelloApiSecret}`);
  const backlogTickets = allCards.data.filter(ticketIsInBacklog);
  return backlogTickets;
};

const askUserToChooseTicket = async backlogTickets => {
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
};

const prepareProjectForTheNewFeature = async ticket => {
  const branchToCreate = `feature${ticket.url.replace(ticket.shortUrl, '')}`;
  const result = await child_process.exec(`cd ${myProjectPath} && git stash && git checkout -B ${branchToCreate}`);
};

const moveTicketToDoing = async ticket => {
  await axios.put(`https://api.trello.com/1/cards/${ticket.id}?idList=${myTrelloDoingColumn}&key=${myTrelloApiKey}&token=${myTrelloApiSecret}`);
};

const openInNewTab = async url => {
  await opn(url, { wait: false });
};

const openTicketInTrello = async ticket => {
  await openInNewTab(ticket.url);
};

const getDoingTickets = async () => {
  const allCards = await axios.get(`https://api.trello.com/1/boards/${myTrelloBoardId}/cards?key=${myTrelloApiKey}&token=${myTrelloApiSecret}`);
  const doingTickets = allCards.data.filter(ticketIsInDoing);
  return doingTickets;
};

const findUserDoingTickets = tickets => {
  return tickets.filter(ticketMemberIsMe);
};

const askUserToConfirmDoingTicket = async tickets => {
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
};

const getPullRequestTemplate = ticket => {
  return `
### Ticket
[${ticket.name}](${ticket.url})
  
### Screenshots
| description |
|----------|
| image |
  `;
};

const pushProjectToGitlab = async () => {
  const result = await child_process.exec(`cd ${myProjectPath} && git push --set-upstream origin ${await getProjectActiveBranch()}`);
};

const getProjectActiveBranch = async () => {
  const activeBranchCommand = await child_process.exec(`cd ${myProjectPath} && git rev-parse --abbrev-ref HEAD`);
  return activeBranchCommand.stdout.replace(/\n/g, "");
};

const getPullRequest = async id => {
  const pullRequest = (await axios.get(
    `${myGitlabAPIProjectUrl}/merge_requests/${id}`,
    {
      headers:
        {
          'Private-Token': myGitlabApiToken
        }
    }
  ));
  return pullRequest;
};

const createPullRequest = async ticket => {
  const payload = {
    source_branch: await getProjectActiveBranch(),
    target_branch: myGitlabMainBranch,
    title: ticket.name,
    description: getPullRequestTemplate(ticket),
  };
  const pullRequest = await axios.post(
    `${myGitlabAPIProjectUrl}/merge_requests`,
    payload,
    {
      headers:
        {
          'Private-Token': myGitlabApiToken
        }
    }
  ).catch(async err => await getPullRequest(err.response.data.message[0].split('!')[1]));
  return pullRequest.data;
};

const openPullRequestInNewTab = async pullRequest => {
  await openInNewTab(pullRequest.web_url);
};

const getOpenMergeRequests = async () => {
  const pullRequest = (await axios.get(
    `${myGitlabAPIProjectUrl}/merge_requests?state=opened`,
    {
      headers:
        {
          'Private-Token': myGitlabApiToken
        }
    }
  ));
  return pullRequest.data;
};

const askUserToConfirmReadingCommits = async () => {
  const question = {
    type: 'list',
    name: 'ticket',
    message: 'Have you read your code to prevent PR feedback?',
    choices: [
      { name: "Oui" },
      { name: "Non" },
    ],
  };
  await inquirer.prompt([question]);
};

const _ = async () => {
  let tickets = null;
  let ticket = null;
  switch (process.argv[2]) {
    case 'dev':
      tickets = await getBacklogTickets();
      ticket = await askUserToChooseTicket(tickets);
      await prepareProjectForTheNewFeature(ticket);
      await moveTicketToDoing(ticket);
      // await openTicketInTrello(ticket);
      break;
    case 'pr':
      tickets = await getDoingTickets();
      tickets = findUserDoingTickets(tickets);
      ticket = await askUserToConfirmDoingTicket(tickets);
      await Promise.all([
        pushProjectToGitlab(),
        askUserToConfirmReadingCommits(),
      ]);
      const pullRequest = await createPullRequest(ticket);

      await openPullRequestInNewTab(pullRequest);
      break;
  }
};

_();