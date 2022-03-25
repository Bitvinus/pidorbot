const members = require('./userMembers');
const tiPidor = require('./phrases');
const phrasesArr = require('./phrases');
const TelegramApi = require('node-telegram-bot-api');
const schedule = require('node-schedule');
require('dotenv').config();

const bot = new TelegramApi(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/startbot/, async (msg) => {
  const chatId = msg.chat.id;
  console.log('Bot started in:' + chatId + ' at ' + new Date());
  const job = schedule.scheduleJob('0 0 06 * * 0-6', function () {
    const keys = Object.keys(members.members);
    const member = keys[Math.floor(Math.random() * keys.length)];
    members.members[member] = members.members[member] + 1;

    const phrase =
      phrasesArr.phrasesArr[
        Math.floor(Math.random() * phrasesArr.phrasesArr.length)
      ];
    const pidorPhrase =
      tiPidor.tiPidor[Math.floor(Math.random() * tiPidor.tiPidor.length)];

    const sorted = Object.fromEntries(
      Object.entries(members.members).sort(([, a], [, b]) => b - a),
    );
    const scoreList = Object.entries(sorted).map(
      ([key, value], i) => `${i + 1}) ${key.slice(1)}: ${value}`,
    );

    setTimeout(() => {
      bot.sendMessage(chatId, phrase[0]);
    }, 1);
    setTimeout(() => {
      bot.sendMessage(chatId, phrase[1]);
    }, 2500);
    setTimeout(() => {
      bot.sendMessage(chatId, `${pidorPhrase} ${member}`);
    }, 4500);
    setTimeout(() => {
      bot.sendMessage(chatId, `Топ пидоров:\n\n${scoreList.join('\n')}`);
    }, 6000);
  });
});
