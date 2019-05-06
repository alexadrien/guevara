const MESSAGES = {
  TRELLO_TOKEN: `
Please enter your trello developer token
You can find on here here : 

https://trello.com/app-key

`,
  TRELLO_SECRET: token => `
Please enter your trello developer secret
You can find on here here :
https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=${token}

`,
  GITHUB_TOKEN: `
Please enter your Github token
You can create one here here :

https://github.com/settings/tokens/new

`,
  GITLAB_PROJECT_URL: `
Please enter your Gitlab project URL

Example :
https://gitlab.example.com/tcheymol/gdi-portal

`,
  GITHUB_PROJECT_URL: `
Please enter your github project URL

Example :
https://github.com/alexadrien/guevara

`,
  GITLAB_TOKEN: (projectUrl) => {
    const path = url.parse(projectUrl);
    const customUserUrl = `${path.protocol}//${path.hostname}/profile/personal_access_tokens`;
    return `
Please enter your Gitlab token
You can create one here here :

${customUserUrl}

`;
  },
};

module.exports = MESSAGES;