const { Telegraf } = require('telegraf')
const fetch = require('node-fetch')
const fs = require('fs')


class HTTPResponseError extends Error {
	constructor(response, ...args) {
		super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
		this.response = response;
	}
}

const downloadFile = (async (ctx, url) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new HTTPResponseError(response)
    }
    const fileStream = fs.createWriteStream('./downloaded_files/asdf.jpg')
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream)
      response.body.on("error", () => {
        // TODO: Some way to access error message?
        ctx.reply('Error while saving file.')
        reject()
      })
      fileStream.on("finish", () => {
        ctx.reply('Succesfully downloaded file.')
        resolve()
      })
    })
  } catch (error) {
    ctx.reply('Error while downloading file: ' + error)
  }
})

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))

bot.on('message', async ctx => {
  const data = ctx.update.message.photo || ctx.update.message.video

  if(!data) {
    return
  }

  const fileId = ctx.update.message.photo ?
    data.slice(-1)[0].file_id :
    data.file_id

  // Files bigger than 20MB may not be downloaded (per bot API); this throws a
  // TelegramError.
  try {
    url =  await ctx.telegram.getFileLink(fileId)
  } catch (error) {
    ctx.reply('Error while getting file link: ' + error)
    return
  }

  downloadFile(ctx, url).then( () => {} )

  ctx.reply('Now downloading file with url ' + url)
})

bot.launch()
