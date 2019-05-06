const url = require('url');

const findProjectLabel = (projectUrl => url.parse(projectUrl).pathname.replace('/', ''));

const findProjectTitle = (projectUrl => findProjectLabel(projectUrl).split('/')[1]);

module.exports = {
  findProjectLabel,
  findProjectTitle,
};