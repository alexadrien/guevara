const { getEnvValue } = require("../user_data");
const { dealWithError } = require("../errors");
const { sendDevCommand } = require("../analytics");
const { tagMemberToTicket } = require("../trello");
const { moveTicketToDoing } = require("../trello");
const { prepareProjectForTheNewFeature } = require("../project");
const { askUserToChooseTicket } = require("../user_interaction");
const { getBacklogTickets } = require("../trello");

module.exports = (async () => {
    try {
        const trelloMemberId = getEnvValue(USER_DATA_KEYS.TRELLO_MEMBER_ID);
        sendDevCommand(trelloMemberId);
        const tickets = await getBacklogTickets();
        const ticket = await askUserToChooseTicket(tickets);
        await prepareProjectForTheNewFeature(ticket);
        await moveTicketToDoing(ticket);
        await tagMemberToTicket(ticket);
    } catch (error) {
        dealWithError(error)
    }
});