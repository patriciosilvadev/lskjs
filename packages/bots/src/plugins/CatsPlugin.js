import sample from 'lodash/sample';
import Plugin from './Plugin';

export default class CatsPlugin extends Plugin {
  name = 'CatsAction';
  messages = [
    'нет, ты котик',
    'нАрКотИК!!1!!',
    'сам ты котик пушистый',
    'кысь-кысь, котяндра',
    'кот-котэ-котик-ко_тян_дроч_ка',
    'килограмм корма за хурму!1!!!1!!',
    'а можно фотку киски ?',
  ];

  narcos = [
    'нАрКотИК!!1!!',
    'сам ты наркотик пушистый',
    'килограмм кокса за хурму!1!!!1!!',
    'а можно фотку нычки ?',
    'http://memesmix.net/media/created/ead0p0.jpg',
    'data:image/jpeg;base64,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',
    'data:image/jpeg;base64,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',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMoP1qqOqf0LACbZExgh2JWwGJGdH9JpGV9mN-OcgVzxDBYutS&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7hk8KDcOOwU3gqTwCwZGrjKebtuqkY3GVF4LC-ia7PwnaEN_L&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_y1ToALEpzY0SRUBFCc-Tscs3WU2wjLNkW5ZcvPLF_K2a8A8P&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3RJuURRZPFb_xl5Db-1f8SxDqbmVh043DgJg0PYglm2aUbt90vA&s',
    'https://i.pinimg.com/originals/19/6a/c6/196ac68e994e399f80d55c7e8d65f134.jpg',
  ];

  async getCat() {
    try {
      const resp = await fetch('https://api.thecatapi.com/v1/images/search?size=full');
      const data = await resp.json();
      const [{ url }] = data;

      return url;
    } catch (err) {
      this.log.error(err);
      return null;
    }
  }

  doAction(message) {
    this.log('doAction');
  }

  runBot(bot, name) {
    if (!this.isRunBot(bot)) return;

    bot.on('message', async (message) => {
      try {
        if (!bot.testMessageRegExp(message, /котик|кусь/)) return;

        if (bot.testMessageRegExp(message, /наркотик|наркусь/)) {
          bot.sendMessage(message, sample(this.narcos));
          return;
        }
        const cat = await this.getCat();
        if (cat && this.percentProbability(50)) {
          bot.sendPhoto(message, cat);
          return;
        }
        bot.sendMessage(message, sample(this.messages));
      } catch (err) {
        this.log.error('runBot', err);
      }
    });
  }
}
