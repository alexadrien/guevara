const { dealWithError } = require("../errors");
const { sendPrCommand } = require("../analytics");
const { createPullRequest } = require("../scv");
const { USER_DATA_KEYS } = require("../user_data");
const { getEnvValue } = require("../user_data");
const { openPullRequestInNewTab } = require("../web_browser");
const { pushProjectToGitlab } = require("../gitlab");
const { askUserToConfirmDoingTicket } = require("../user_interaction");
const { getDoingTickets, findUserDoingTickets } = require("../trello");

module.exports = (async () => {
    try {
        sendPrCommand();
        let tickets = await getDoingTickets();
        const userMemberId = await getEnvValue(USER_DATA_KEYS.TRELLO_MEMBER_ID);
        tickets = findUserDoingTickets(tickets, userMemberId);
        const ticket = await askUserToConfirmDoingTicket(tickets);
        await pushProjectToGitlab();
        const pullRequest = await createPullRequest(ticket);
        await openPullRequestInNewTab(pullRequest);
    } catch (error) {
        dealWithError(error)
    }
});