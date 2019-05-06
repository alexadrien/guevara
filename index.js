#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/.guevara' });
const inquirer = require('inquirer');
const axios = require('axios');
const child_process = require('child-process-promise');
const lodash = require('lodash');
const opn = require('opn');
const url = require('url');

const myTrelloApiKey = process.env.trello_api_key;
const myTrelloApiSecret = process.env.trello_api_secret;
const myTrelloBoardId = process.env.trello_board_id;
const myTrelloSprintColumn = process.env.trello_sprint_backlog_column;
const myTrelloDailyColumn = process.env.trello_daily_column;
const myTrelloDoingColumn = process.env.trello_doing_column;
const myTrelloMemberId = process.env.trello_member_id;
const myGitlabAPIProjectUrl = process.env.gitlab_api_project_url;
const myGitlabApiToken = process.env.gitlab_api_token;
const myGithubAccessToken = process.env.github_access_token;
const myGithubAPIProjectUrl = process.env.github_api_project_url;
const myGitlabMainBranch = 'master';


const COMPATIBLE_PLATFORM = {
  GITHUB: "Github",
  GITLAB: "Gitlab",
};


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
  const result = await child_process.exec(`git stash && git checkout -B ${branchToCreate}`);
};

const moveTicketToDoing = async ticket => {
  await axios.put(`https://api.trello.com/1/cards/${ticket.id}?idList=${myTrelloDoingColumn}&key=${myTrelloApiKey}&token=${myTrelloApiSecret}`);
};

const openInNewTab = async url => {
  await opn(url, { wait: false });
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
  const result = await child_process.exec(`git push --set-upstream origin ${await getProjectActiveBranch()}`);
};

const getProjectActiveBranch = async () => {
  const activeBranchCommand = await child_process.exec(`git rev-parse --abbrev-ref HEAD`);
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

const createPullRequestOnGitlab = async ticket => {
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

const createPullRequestOnGithub = async ticket => {
  const payload = {
    title: ticket.name,
    body: getPullRequestTemplate(ticket),
    head: (await getProjectActiveBranch()),
    base: "master"
  };

  const pullRequest = await axios.post(
    `${myGithubAPIProjectUrl}/pulls?access_token=${myGithubAccessToken}`,
    payload,
  ).catch(async err => await getPullRequest(err.response.data.message[0].split('!')[1]));
  return pullRequest.data;
};

const createPullRequest = async ticket => {
  if (!!myGithubAPIProjectUrl) {
    return await createPullRequestOnGithub();
  } else if (!!myGitlabAPIProjectUrl) {
    return await createPullRequestOnGitlab();
  }
};

const openPullRequestInNewTab = async pullRequest => {
  if (!!myGithubAPIProjectUrl) {
    await openInNewTab(pullRequest.html_url);
  } else if (!!myGitlabAPIProjectUrl) {
    await openInNewTab(pullRequest.web_url);
  }
};

const askUserToConfirmReadingCommits = async () => {
  const question = {
    type: 'list',
    name: 'ticket',
    message: 'Have you read your code to prevent PR feedback?',
    choices: [
      { name: "Yes" },
      { name: "No" },
    ],
  };
  await inquirer.prompt([question]);
};

const askUserForTrelloToken = async () => {
  const question = {
    type: 'input',
    name: 'trelloToken',
    message: `
Please enter your trello developer token
You can find on here here : 

https://trello.com/app-key

`,
  };
  return await inquirer.prompt([question]);
};

const askUserForTrelloSecret = async token => {
  const question = {
    type: 'input',
    name: 'trelloSecret',
    message: `
Please enter your trello developer secret
You can find on here here :
https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=${token}
`,
  };
  return await inquirer.prompt([question]);
};

const askUserForHisPlatform = async () => {
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
  return await inquirer.prompt([question]);
};

const askUserForHisGithubToken = async () => {
  const question = {
    type: 'input',
    name: 'githubToken',
    message: `
Please enter your Github token
You can create one here here :

https://github.com/settings/tokens/new
`,
  };
  return await inquirer.prompt([question]);
};

const askUserForHisGitlabProjectUrl = async () => {
  const question = {
    type: 'input',
    name: 'gitlabUrl',
    message: `
Please enter your Gitlab project URL
`,
  };
  return await inquirer.prompt([question]);
};

const findProjectLabel = projectUrl => {
  const path = url.parse(projectUrl).pathname;
  return path.replace('/', '');
};

const askUserToCreateAToken = async projectUrl => {
  const path = url.parse(projectUrl);
  const customUserUrl = `${path.protocol}//${path.hostname}/profile/personal_access_tokens`;
  const question = {
    type: 'input',
    name: 'gitlabToken',
    message: `
Please enter your Gitlab token
You can create one here here :

${customUserUrl}

`,
  };
  return await inquirer.prompt([question]);
};

const getGitlabAPIUrl = async (projectUrl, token) => {
  const parsedUrl = url.parse(projectUrl);
  const projectLabel = findProjectLabel(projectUrl);
  const projectTitle = projectLabel.split('/')[1];
  return axios.get(
    `${parsedUrl.protocol}//${parsedUrl.hostname}/api/v4/search?scope=projects&search=${projectTitle}`,
    {
      headers: {
        "PRIVATE-TOKEN": token
      }
    }
  )
    .then(res => res.data.filter(item => item.path_with_namespace === projectLabel))
    .then(project => project && project[0].id)
    .then(id => `${parsedUrl.protocol}//${parsedUrl.hostname}/api/v4/projects/${id}`);
};

