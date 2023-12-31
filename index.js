const TelegramBot = require('node-telegram-bot-api');
const geolib = require('geolib');
// Установите токен вашего бота, полученный от BotFather
const token = '6313272133:AAFrgEoF308LVQVuLNbsT0q_FL4HuEbRFT4';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Фиктивные данные о морях и проливах для примера
const seasAndStraits = [
  { name: 'Black Sea', latitude: 42.0, longitude: 36.0 },
  { name: 'Mediterranean Sea', latitude: 35.0, longitude: 18.0 },
  { name: 'Arctic Ocean', latitude: 83.0, longitude: 0.0 },
  // другие моря и проливы
];

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Привет! Отправьте свое местоположение, чтобы определить ближайшее море или пролив.');
});

// Обработчик команды /location
bot.onText(/\/location/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  bot.sendMessage(chatId, 'Пожалуйста, отправьте свое местоположение.');

  // Ожидаем местоположение пользователя
  bot.once('location', (locationMsg) => {
    const location = locationMsg.location;

    // Находим ближайшее море или пролив
    const nearestSeaOrStrait = geolib.findNearest({ latitude: location.latitude, longitude: location.longitude }, seasAndStraits);

    // Отправляем сообщение с ближайшим морем или проливом
    if (nearestSeaOrStrait) {
      bot.sendMessage(chatId, `Ближайшее море или пролив: ${nearestSeaOrStrait.name}`);
    } else {
      bot.sendMessage(chatId, 'Не удалось найти ближайшее море или пролив.');
    }
  });

  // Запрашиваем местоположение
  bot.sendLocation(chatId, 'Пожалуйста, отправьте свое местоположение.');
});
