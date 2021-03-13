const { Telegraf } = require('telegraf')
const fetch = require('node-fetch')
const fs = require('fs')

const downloadDirectory = './downloaded_files'


class HTTPResponseError extends Error {
	constructor(response, ...args) {
		super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
		this.response = response;
	}
}

const downloadFile = (async (reply, url, fileName) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new HTTPResponseError(response)
    }
    const fileStream = fs.createWriteStream(fileName)
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream)
      response.body.on("error", () => {
        // TODO: Some way to access error message?
        reply('Error while saving file with url ' + url + '.')
        reject()
      })
      fileStream.on("finish", () => {
        reply('Succesfully downloaded ' + fileName + '.')
        resolve()
      })
    })
  } catch (error) {
    reply('Error while downloading file: ' + error)
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

  // isoformat-timestamp where we remove all occurences of ':' and '.' (so the
  // filename constructed from it does not cause trouble on Windows)
  timestamp = (new Date().toISOString()).replace(/:/g, '').replace(/\./g, '')
  urlFileName = url.split('/').slice(-1)[0]
  extension = urlFileName.split('.')[1]
  fileName = downloadDirectory + '/' + timestamp + '.' + extension

  downloadFile(ctx.reply, url, fileName)
})

bot.launch()
