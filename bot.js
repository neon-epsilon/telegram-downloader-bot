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

async function downloadFile(reply, url, fileName) {
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
}

function makeMessageHandler() {
  var globalMessageNumber = 0
  return (async ctx => {
    const localMessageNumber = ++globalMessageNumber
    const messageTime = new Date()

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

    const timestamp = messageTime.toISOString().replace(/:/g, '').split('.')[0]
    const urlFileName = url.split('/').slice(-1)[0]
    const [base, extension] = urlFileName.split('.')
    const fileName = downloadDirectory + '/' + timestamp + '_' + String(localMessageNumber).padStart(4, '0') + '.' + extension

    downloadFile(ctx.reply, url, fileName)
  })
}


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.on('message', makeMessageHandler() )

bot.launch()
