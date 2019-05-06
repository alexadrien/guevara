const axios = require('axios');
const lodash = require('lodash');
const { USER_DATA_KEYS } = require("./user_data");
const { getEnvValue } = require("./user_data");
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

const getAllUserBoards = (async () => {
  const trelloToken = await getEnvValue(USER_DATA_KEYS.TRELLO_API_KEY);
  const trelloSecret = await getEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET);
  return await axios.get(`https://api.trello.com/1/members/me/boards?key=${trelloToken}&token=${trelloSecret}`)
    .then(response => response.data)
    .then(boards => boards.map(board => ({ value: board.id, name: board.name })))
});

const getUserMemberId = (async () => {
  const trelloToken = await getEnvValue(USER_DATA_KEYS.TRELLO_API_KEY);
  const trelloSecret = await getEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET);
  return await axios.get(`https://api.trello.com/1/members/me?key=${trelloToken}&token=${trelloSecret}`)
    .then(response => response.data.id);
});

const getAllBoardColumns = (async () => {
  const trelloToken = await getEnvValue(USER_DATA_KEYS.TRELLO_API_KEY);
  const trelloSecret = await getEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET);
  const boardId = await getEnvValue(USER_DATA_KEYS.TRELLO_BOARD_ID);
  return await axios.get(`https://api.trello.com/1/boards/${boardId}/lists?key=${trelloToken}&token=${trelloSecret}`)
    .then(response => response.data)
    .then(lists => lists.map(list => ({ value: list.id, name: list.name })))
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
  getAllUserBoards,
  getAllBoardColumns,
  ticketIsInDoing,
  ticketMemberIsMe,
  getBacklogTickets,
  moveTicketToDoing,
  getUserMemberId,
  getDoingTickets,
  findUserDoingTickets,
};