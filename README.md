# Running the bot

To start the bot, export the token for your bot (obtained from the @botfather bot) as environment variable and run it with node:
```bash
export BOT_TOKEN="MY_BOT_TOKEN"
node bot.js
```

Then start a chat with your bot and paste any documents, photos or videos there. They will be automatically downloaded into `./downloaded_files`. Since Telegram does not track file names for photos and vides, the file name will be the timestamp of the message sent to the bot.

**Note**: the download works only for files smaller than 20MB. This is due to a restriction in the bot API provided by Telegram.

# Debug mode

To see debug messages, set the environment variable `NODE_DEBUG=app`:
```bash
NODE_DEBUG=app node bot.js
```
