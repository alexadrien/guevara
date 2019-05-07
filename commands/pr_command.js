const { openPullRequestInNewTab } = require("../web_browser");
const { createPullRequest } = require("../pull_request");
const { pushProjectToGitlab } = require("../gitlab");
const { askUserToConfirmDoingTicket, askUserToConfirmReadingCommits } = require("../user_interaction");
const { getDoingTickets, findUserDoingTickets } = require("../trello");

module.exports = (async () => {
  let tickets = await getDoingTickets();
  tickets = findUserDoingTickets(tickets);
  const ticket = await askUserToConfirmDoingTicket(tickets);
  await Promise.all([
    pushProjectToGitlab(),
    askUserToConfirmReadingCommits(),
  ]);
  const pullRequest = await createPullRequest(ticket);
  await openPullRequestInNewTab(pullRequest);
});