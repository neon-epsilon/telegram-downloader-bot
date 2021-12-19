const { Telegraf } = require('telegraf')
const fetch = require('node-fetch')
const fs = require('fs')
const util = require('util')

const debuglog = util.debuglog('app')

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
    // Keep track of message number and make it part of the name of the
    // downloaded file. This makes sure that image order is preserved when
    // forwarding many images to the bot.
    const localMessageNumber = ++globalMessageNumber
    const messageTime = new Date()

    debuglog("Message handler received message:")
    debuglog(ctx.update.message)

    const data = ctx.update.message.photo || ctx.update.message.video || ctx.update.message.document

    if(!data) {
      return
    }

    const fileId = ctx.update.message.photo ?
      // Photos have two file ids: one for the thumbnail (which comes first)
      // and one for the actual photo. We want the latter.
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
    const [_base, extension] = urlFileName.split('.')
    const fileNamePrefix = downloadDirectory + '/' + timestamp + '_' + String(localMessageNumber).padStart(4, '0')
    // A document has a proper file name; for other types of data use generate
    // a file name from the timestamp.
    const fileName = ctx.update.message.document ?
      fileNamePrefix + '_' + data.file_name :
      fileNamePrefix + '.' + extension

    downloadFile(ctx.reply, url, fileName)
  })
}


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.on('message', makeMessageHandler() )

bot.launch()
