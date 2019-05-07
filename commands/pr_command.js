const { USER_DATA_KEYS } = require("../user_data");
const { getEnvValue } = require("../user_data");
const { openPullRequestInNewTab } = require("../web_browser");
const { createPullRequest } = require("../pull_request");
const { pushProjectToGitlab } = require("../gitlab");
const { askUserToConfirmDoingTicket, askUserToConfirmReadingCommits } = require("../user_interaction");
const { getDoingTickets, findUserDoingTickets } = require("../trello");

module.exports = (async () => {
  let tickets = await getDoingTickets();
  const userMemberId = getEnvValue(USER_DATA_KEYS.TRELLO_MEMBER_ID);
  tickets = findUserDoingTickets(tickets, userMemberId);
  const ticket = await askUserToConfirmDoingTicket(tickets);
  await Promise.all([
    pushProjectToGitlab(),
    askUserToConfirmReadingCommits(),
  ]);
  const pullRequest = await createPullRequest(ticket);
  await openPullRequestInNewTab(pullRequest);
});