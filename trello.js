const axios = require('axios');
const lodash = require('lodash');
const { getTrelloApiSecret } = require("./user_data");
const { getTrelloApiKey } = require("./user_data");
const { getTrelloBoardId } = require("./user_data");
const { getMyTrelloMemberId } = require("./user_data");
const { getTrelloDailyColumn } = require("./user_data");
const { getTrelloDoingColumn } = require("./user_data");
const { getTrelloSprintColumn } = require("./user_data");


const ticketIsInBacklog = (ticket => {
  const acceptedColumns = [
    getTrelloSprintColumn(),
    getTrelloDailyColumn(),
  ];
  return lodash.indexOf(acceptedColumns, ticket.idList) > -1;
});

const ticketIsInDoing = (ticket => {
  const acceptedColumns = [
    getTrelloDoingColumn(),
  ];
  return lodash.indexOf(acceptedColumns, ticket.idList) > -1;
});

const ticketMemberIsMe = (ticket => {
  return lodash.indexOf(ticket.idMembers, getMyTrelloMemberId()) > -1;
});

const getBacklogTickets = (async () => {
  const allCards = await axios.get(`https://api.trello.com/1/boards/${getTrelloBoardId()}/cards?key=${getTrelloApiKey()}&token=${getTrelloApiSecret()}`);
  return allCards.data.filter(ticketIsInBacklog);
});

const moveTicketToDoing = (async ticket => {
  await axios.put(`https://api.trello.com/1/cards/${ticket.id}?idList=${getTrelloBoardId()}&key=${getTrelloApiKey()}&token=${getTrelloApiSecret()}`);
});

const getDoingTickets = (async () => {
  const allCards = await axios.get(`https://api.trello.com/1/boards/${getTrelloBoardId()}/cards?key=${getTrelloApiKey()}&token=${getTrelloApiSecret()}`);
  return allCards.data.filter(ticketIsInDoing);
});

const findUserDoingTickets = (tickets => tickets.filter(ticketMemberIsMe));


module.exports = {
  ticketIsInBacklog,
  ticketIsInDoing,
  ticketMemberIsMe,
  getBacklogTickets,
  moveTicketToDoing,
  getDoingTickets,
  findUserDoingTickets,
};