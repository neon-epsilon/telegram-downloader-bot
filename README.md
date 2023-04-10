This is a bot for the Telegram messenger that allows for bulk download of media files by storing any pictures, videos etc. sent to it in a local directory.

# Idea

When I first developed this bot in 2020, there was no easy way to batch download media files from the Telegram messenger to a PC.
(This may no longer be true now due to Telegram's web front end having progressed since then).

This was unfortunate because friends and I frequently shared photos and videos via Telegram group chats, e.g. after going on a hike together.
(And in 2020, there was really not too much else you could do with friends at times...)
The lack of a batch download prevented me from easily storing these memories locally on a hard disk.

Of course, one could work around that by just connecting my phone to my PC.
But that is rather cumbersome, requires digging through Telegram's local files and is impractical for retrieving specific files from multiple chats.

However, media files could easily be forwarded from one chat to another, even in bulk.
This chat could be with anyone, even with a bot - which can be easily written using Telegram's API.

Putting one and one together, I decided to write a bot that I can run locally on my PC.
Whenever I send it any media files, it automatically downloads them for me to a local directory; this makes it easy to store them locally and back them up however I want to.

# Installation

1. Follow [the instructions](https://core.telegram.org/bots/features#botfather) to obtain a new bot token.

1. Install node and npm (e.g. via [nvm](https://github.com/nvm-sh/nvm)).

1. In this directory, run

   ```bash
   $ npm install
   ```

# Running the bot

1. Export the token for your bot as environment variable and run it with node:

   ```bash
   $ export BOT_TOKEN="MY_BOT_TOKEN"
   $ node bot.js
   ```

1. Start a chat with your bot and paste any documents, photos or videos there.

Any files sent to the bot will be automatically downloaded into `./downloaded_files`.
Since Telegram does not track file names for photos and videos, the file name will be the time stamp of the message sent to the bot.

**Note**: the download works only for files smaller than 20MB. This is due to a restriction in the bot API provided by Telegram.

# Debug mode

To see debug messages, set the environment variable `NODE_DEBUG=app`:

```bash
$ NODE_DEBUG=app node bot.js
```
