const { dealWithError } = require("../errors");
const { sendPrCommand } = require("../analytics");
const { createPullRequest } = require("../scv");
const { USER_DATA_KEYS } = require("../user_data");
const { getEnvValue } = require("../user_data");
const { openPullRequestInNewTab } = require("../web_browser");
const { pushProjectToGitlab } = require("../gitlab");
const { askUserToConfirmDoingTicket } = require("../user_interaction");
const { getDoingTickets, findUserDoingTickets } = require("../trello");
const lodash = require('lodash');

module.exports = (async () => {
    try {
        const trelloMemberId = await getEnvValue(USER_DATA_KEYS.TRELLO_MEMBER_ID);
        sendPrCommand(trelloMemberId);
        let tickets = await getDoingTickets();
        const userMemberId = await getEnvValue(USER_DATA_KEYS.TRELLO_MEMBER_ID);
        tickets = findUserDoingTickets(tickets, userMemberId);
        let ticket;
        if (tickets.length > 1 ) {
            ticket = await askUserToConfirmDoingTicket(tickets);
        } else {
            ticket = lodash.first(tickets);
        }
        await pushProjectToGitlab();
        const pullRequest = await createPullRequest(ticket);
        await openPullRequestInNewTab(pullRequest);
    } catch (error) {
        dealWithError(error)
    }
});