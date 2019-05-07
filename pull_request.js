const getPullRequestTemplateDescription = ticket => {
  return (`
### Ticket
[${ticket.name}](${ticket.url})
  
### Screenshots
| description |
|----------|
| image |
  `);
};

module.exports = {
  getPullRequestTemplateDescription,
};