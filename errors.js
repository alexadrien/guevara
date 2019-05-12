const { sendErrorCommand } = require("./analytics");

const dealWithError = (error) => {
    console.log(error.name);
    console.log(error.message);
    console.log(error.stack);
    console.log(`
... Something went wrong :/ 
Sending error to developer.
        `);
    sendErrorCommand(error);
};

module.exports = {
    dealWithError,
};