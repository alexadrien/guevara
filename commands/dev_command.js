const { moveTicketToDoing } = require("../trello");
const { prepareProjectForTheNewFeature } = require("../project");
const { askUserToChooseTicket } = require("../user_interaction");
const { getBacklogTickets } = require("../trello");

module.exports = (async () => {
  const tickets = await getBacklogTickets();
  const ticket = await askUserToChooseTicket(tickets);
  await prepareProjectForTheNewFeature(ticket);
  await moveTicketToDoing(ticket);
});