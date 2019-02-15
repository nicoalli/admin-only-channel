# admin-only-channel
Slack app that will delete messages from non-whitelisted (admin) users.

When admin users post a message in listed channels their message will be deleted along with an error message indicating they are an unauthorized user.

This is ideal for "read-only" channels such as announcement channels where only privileged users are allowed to post. Also effective for decluttering channels and ensuring imporant messages are accessible.

# installation

1. Create a heroku app
2. Create a slack app with a bot user
3. Note down oauth token and bot token
4. Invite bot user to admin only channels
5. Clone and push this repo to heroku
6. Add the following config vars to heroku

ADMIN_USERS - comma separated list of user IDs
ADMIN_CHANNELS - comma separated list of channel IDs
BOT_TOKEN - bot authorization token of slack app
OAUTH_TOKEN - oauth token of slack app
