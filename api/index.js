const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling:true});
const request = require('request');
const movieUrl = 'http://www.omdbapi.com/?t=';
const movieApi = process.env.MOVIE_API_KEY;


bot.onText(/\/movie (.+)/, (msg, match) => {
    const movie = match[1];
    const chatId = msg.chat.id;
    request(`${movieUrl}${movie}&apikey=${movieApi}`, (error, response, body) => {
        if(!error && response.statusCode == 200) {
            bot.sendMessage(chatId, `_Looking for ${movie}_` + '...', {parse_mode:'Markdown'});
            bot.sendMessage(chatId, 'Okay, this is what I found...\n')
            .then((msg) => {
                const res = JSON.parse(body);
                bot.sendPhoto(chatId, res.Poster, {caption: 'Title: ' + res.Title + '\nReleased: ' + res.Released + '\nDirector: ' + res.Director + '\nActors: ' + res.Actors +
                '\nPlot: ' + res.Plot})
                bot.sendMessage(chatId, 'Is there anything else I could do for you my master?')
            });
        }
    });
});