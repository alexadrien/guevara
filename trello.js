const axios = require('axios');
const lodash = require('lodash');
const { CHOICES } = require("./user_interaction/choices");
const { USER_DATA_KEYS } = require("./user_data");
const { getEnvValue } = require("./user_data");
const { getTrelloApiSecret } = require("./user_data");
const { getTrelloApiKey } = require("./user_data");
const { getTrelloBoardId } = require("./user_data");
const { getMyTrelloMemberId } = require("./user_data");
const { getTrelloDailyColumn } = require("./user_data");
const { getTrelloDoingColumn } = require("./user_data");
const { getTrelloSprintColumn } = require("./user_data");


const ticketIsInBacklog = async ticket => {
  const sprintColumn = await getEnvValue(USER_DATA_KEYS.TRELLO_SPRINT_COLUMN);
  const dailyColumn = await getEnvValue(USER_DATA_KEYS.TRELLO_DAILY_COLUMN);
  const acceptedColumns = [
    sprintColumn,
    dailyColumn,
  ];
  return lodash.indexOf(acceptedColumns, ticket.idList) > -1;
};

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

const ticketMemberIsMe = memberId => (ticket => {
  return lodash.indexOf(ticket.idMembers, memberId) > -1;
});

const getBacklogTickets = (async () => {
  const sprintBacklogId = await getEnvValue(USER_DATA_KEYS.TRELLO_SPRINT_COLUMN);
  const dailyId = await getEnvValue(USER_DATA_KEYS.TRELLO_DAILY_COLUMN);
  const trelloApiKey = await getEnvValue(USER_DATA_KEYS.TRELLO_API_KEY);
  const trelloApiSecret = await getEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET);
  const allSprintBacklogCards = await axios.get(`https://api.trello.com/1/lists/${sprintBacklogId}/cards?key=${trelloApiKey}&token=${trelloApiSecret}`)
    .then(response => response.data);
  let allDailyBacklogCards = [];
  if (dailyId !== CHOICES.NO) {
    allDailyBacklogCards = await axios.get(`https://api.trello.com/1/lists/${dailyId}/cards?key=${trelloApiKey}&token=${trelloApiSecret}`)
      .then(response => response.data);
  }
  return [
    ...allDailyBacklogCards,
    ...allSprintBacklogCards,
  ];
});

const moveTicketToDoing = (async ticket => {
  const doingColumnId = await getEnvValue(USER_DATA_KEYS.TRELLO_DOING_COLUMN);
  const trelloKey = await getEnvValue(USER_DATA_KEYS.TRELLO_API_KEY);
  const trelloSecret = await getEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET);
  await axios.put(`https://api.trello.com/1/cards/${ticket.id}?idList=${doingColumnId}&key=${trelloKey}&token=${trelloSecret}`);
});

const tagMemberToTicket = (async ticket => {
  const memberId = await getEnvValue(USER_DATA_KEYS.TRELLO_MEMBER_ID);
  const trelloKey = await getEnvValue(USER_DATA_KEYS.TRELLO_API_KEY);
  const trelloSecret = await getEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET);
  await axios.put(`https://api.trello.com/1/cards/${ticket.id}?idMembers=${memberId}&key=${trelloKey}&token=${trelloSecret}`);
});

const getDoingTickets = (async () => {
  const doingColumnId = await getEnvValue(USER_DATA_KEYS.TRELLO_DOING_COLUMN);
  const trelloKey = await getEnvValue(USER_DATA_KEYS.TRELLO_API_KEY);
  const trelloSecret = await getEnvValue(USER_DATA_KEYS.TRELLO_API_SECRET);
  const allCards = await axios.get(`https://api.trello.com/1/lists/${doingColumnId}/cards?key=${trelloKey}&token=${trelloSecret}`)
    .then(response => response.data)
    .catch(console.log);
  return allCards;
});

const findUserDoingTickets = (tickets, memberId) => tickets.filter(ticketMemberIsMe(memberId));


module.exports = {
  ticketIsInBacklog,
  getAllUserBoards,
  getAllBoardColumns,
  tagMemberToTicket,
  ticketIsInDoing,
  ticketMemberIsMe,
  getBacklogTickets,
  moveTicketToDoing,
  getUserMemberId,
  getDoingTickets,
  findUserDoingTickets,
};