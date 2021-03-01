const fs = require('fs')
const readline = require('readline')
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))

bot.on('message', ctx => {
  const files = ctx.update.message.photo

  if(files) {
    ctx.reply(files)
  }
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
