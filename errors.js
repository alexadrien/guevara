const { sendErrorCommand } = require("./analytics");

class GuevaraFileNotOkError extends Error {
  constructor(...params) {
    super(...params);
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, GuevaraFileNotOkError);
    }
    this.name = 'WrongGuevaraFile';
    this.message = `
Your .guevara file seems to have a problem.

Please run

    guevara init

and follow instructions to fix the problem.
If that doesn't fix the problem, please delete .guevara and try guevara init again.

    cat .guevara
    rm .guevara
    guevara init

`;
  }
}

const dealWithError = (error) => {
    console.log(error.stack);
    console.log(`
  ... Something went wrong :/ 
  Sending error to developer.
        `);
    sendErrorCommand(error);
};

module.exports = {
    dealWithError,
    GuevaraFileNotOkError,
};