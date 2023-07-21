const TelegramBot = require('node-telegram-bot-api');

// Установите токен вашего бота, полученный от BotFather
const token = '6313272133:AAFrgEoF308LVQVuLNbsT0q_FL4HuEbRFT4';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Обработчик команды /location
bot.onText(/\/location/, async (msg) => {
  const chatId = msg.chat.id;

  // Запрашиваем разрешение на доступ к местоположению
  const request = await bot.sendMessage(chatId, 'Пожалуйста, предоставьте доступ к вашему местоположению.', {
    reply_markup: {
      keyboard: [
        [
          {
            text: 'Предоставить местоположение',
            request_location: true,
          },
        ],
      ],
      one_time_keyboard: true,
    },
  });

  // Ожидаем ответа с местоположением
  bot.onReplyToMessage(chatId, request.message_id, (location) => {
    // Обработка полученных координат
    const latitude = location.location.latitude;
    const longitude = location.location.longitude;

    // Формирование ссылки на карту OpenStreetMap
    const mapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=12/${latitude}/${longitude}`;

    // Отправляем сообщение с полученными координатами и ссылкой на карту OpenStreetMap
    bot.sendMessage(chatId, `Ваши координаты: ${latitude}, ${longitude}`);
    bot.sendMessage(chatId, mapUrl);
  });
});
