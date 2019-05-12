const { sendDevCommand } = require("../analytics");
const { tagMemberToTicket } = require("../trello");
const { moveTicketToDoing } = require("../trello");
const { prepareProjectForTheNewFeature } = require("../project");
const { askUserToChooseTicket } = require("../user_interaction");
const { getBacklogTickets } = require("../trello");

module.exports = (async () => {
  sendDevCommand();
  const tickets = await getBacklogTickets();
  const ticket = await askUserToChooseTicket(tickets);
  await prepareProjectForTheNewFeature(ticket);
  await moveTicketToDoing(ticket);
  await tagMemberToTicket(ticket);
});