### Alias

`alias dev='/usr/local/bin/node ~/projets/myautomationscripts/index.js dev'`

`alias pr='/usr/local/bin/node ~/projets/myautomationscripts/index.js pr'`


### .env

Example of the .env to create

```
trello_api_key=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
trello_api_secret=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
trello_board_id=xxxxxxxxx
trello_sprint_backlog_column=xxxxxxxxxxxxxxxxxxxxxxxx
trello_daily_column=xxxxxxxxxxxxxxxxxxxxxxxx
trello_doing_column=xxxxxxxxxxxxxxxxxxxxxxxx
trello_member_id=xxxxxxxxxxxxxxxxxxxxxxxx
project_path=~/sipios/gmi-portal
gitlab_api_project_url=https://gitlab.example.com/api/v4/projects/259
gitlab_api_token=xxxxxxxxxxxxxxxxxx
```

## Todo 
[] Github compatibility
[] Change .env in a more particular filename
[] Avoid having the path variable 
[] Tag the person on the ticket if it is not done
[] Display daily backlog column first