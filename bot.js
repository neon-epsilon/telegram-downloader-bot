const fs = require('fs')
const readline = require('readline')
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))

bot.on('message', ctx => {
  const data = ctx.update.message.photo || ctx.update.message.video

  if(!data) {
    return
  }

  const fileId = ctx.update.message.photo ?
    data.slice(-1)[0].file_id :
    data.file_id

  ctx.telegram.getFileLink(fileId).then(url => {
    ctx.reply(url)
  })
})
//bot.help((ctx) => ctx.reply('Supported commands: /frequency'))
//bot.command('frequency', (ctx) => {
//  const rl = readline.createInterface({
//    input: fs.createReadStream('access.log')
//  })
//
//  const freq = {}
//  rl.on('line', (line) => {
//    const ip = line.split(' ')[0]
//    freq[ip] = (freq[ip] + 1) || 1
//  })
//
//  rl.on('close', () => {
//    const list = Object.entries(freq)
//      .sort((a,b) => b[1] - a[1])
//    ctx.reply(list.join("\n"))
//  })
//})


bot.launch()
