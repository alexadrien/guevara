const Analytics = require('analytics-node');

const client = new Analytics('S6SdoTARsq88FHr2GEHQh9UxDFB50tnI');

const ANALYTICS_EVENTS = {
    INIT_COMMAND: "Init",
    DEV_COMMAND: "Dev",
    PR_COMMAND: "Pr",
};

const sendCommand = (event, userId) => client.track({
    event: event,
    userId: userId,
});

const sendInitCommand = (userId) => sendCommand(ANALYTICS_EVENTS.INIT_COMMAND, userId || "-");
const sendDevCommand = (userId) => sendCommand(ANALYTICS_EVENTS.DEV_COMMAND, userId || "-");
const sendPrCommand = (userId) => sendCommand(ANALYTICS_EVENTS.PR_COMMAND, userId || "-");

module.exports = {
    sendInitCommand,
    sendDevCommand,
    sendPrCommand,
};