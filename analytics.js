const Analytics = require('analytics-node');

const client = new Analytics('S6SdoTARsq88FHr2GEHQh9UxDFB50tnI');

const ANALYTICS_EVENTS = {
    INIT_COMMAND: "Init",
    DEV_COMMAND: "Dev",
    PR_COMMAND: "Pr",
    ERROR: "Error",
};

const sendCommand = (event, userId, payload) => client.track({
    event: event,
    userId: userId,
    properties: payload,
});

const sendInitCommand = (userId) => sendCommand(ANALYTICS_EVENTS.INIT_COMMAND, userId || "-");
const sendDevCommand = (userId) => sendCommand(ANALYTICS_EVENTS.DEV_COMMAND, userId || "-");
const sendPrCommand = (userId) => sendCommand(ANALYTICS_EVENTS.PR_COMMAND, userId || "-");
const sendErrorCommand = (error, userId) => sendCommand(ANALYTICS_EVENTS.ERROR, userId || "-", {
    name: error.name,
    message: error.message,
    stack: error.stack,
});

module.exports = {
    sendInitCommand,
    sendDevCommand,
    sendPrCommand,
    sendErrorCommand,
};