const TeleBot = require('telebot');

const bot = new TeleBot({
    token: '701590762:AAFwoxFEZLYkT4WjBgR6fHcNizvI9KW0QLA' // Telegram Bot API token.
});

var historypics = ["history1.jpg", "history2.jpg"];
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost/flappyBirdDB';
var faqVragen = [{"vraag": "kjnadkjnas", "antwoord": "asasd"},{"vraag": "waar staat mml voor?", "antwoord": "Metis Montessori Lyceum"},{"vraag": "wat hebben we voor speciale vakken?", "antwoord": "Informatica en O&O(technasium)."}];

// faqVragen[0].vraag

mongo.connect(url, { useNewUrlParser: true }, function(err, db) {
  if(err) throw err;
});

mongo.connect(url, { useNewUrlParser: true }, function(err, db) {
    db.db("flappyBirdDB").collection('highscores').insertOne({
        "naam": "Herman",
        "score": 26
    });
    db.close();
});

bot.on('/historypics', (msg) => {
    console.log(msg.from.id + "(" + msg.from.first_name + " " + msg.from.last_name + ") heeft een foto opgevraagd");
    var foto = historypics[(Math.floor(Math.random() * historypics.length))];
    return bot.sendPhoto(msg.from.id, foto);
});

bot.on('/start', (msg) => {
    var arg = { replyToMessage: msg.message_id }
    console.log(msg.from.id + "(" + msg.from.first_name + " " + msg.from.last_name + ") heeft het /start commando gegeven");
    return bot.sendMessage(msg.from.id, "Hallo, Welkom bij de open dag!!", arg);
});

bot.on(/^\/plattegrond (.+)/, (msg, props) => {
  const text = props.match[1];
  console.log(text);
  return bot.sendPhoto(msg.from.id, text + ".jpg");
});

// bot.on('/faq', (msg) => {
//   console.log(msg.from.id + "(" + msg.from.first_name + " " + msg.from.last_name + ") vroeg om veelgestelde vragen");
//   return bot.sendMessage(msg.from.id, "veelgestelde vragen: 1. waar staat MML voor? 2. wat hebben we voor speciale vakken?");
// });

bot.on(/^\/faq(.*)/, (msg, props) => {
  console.log("test");

  const faq = props.match[1];
  console.log(faq)
  faq = faq.replace(/\s/g, '')
  if (!faq) {
    return bot.sendMessage(msg.from.id, "veelgestelde vragen: 1. waar staat MML voor? 2. wat hebben we voor speciale vakken?");
  }

  const antwoord = faqVragen[faq].antwoord
  return bot.sendMessage(msg.from.id, antwoord);
});

bot.on(/^\/subscribe (.*)/, (msg, props) => {
  mongo.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) {
      console.log(err);
    }
    console.log(props);
    console.log(props.match[1]);
  	db.db("flappyBirdDB").collection('highscores').insertOne({
      	"naam": msg.from.first_name,
      	"email": props.match[1]
  	});
  	db.close();
  });
});

bot.on(/scores/, (msg, props) => {
  mongo.connect(url, { useNewUrlParser: true }, function(err, db) {
    db.db('flappybirdDB').collection('highscores').findOne({}, function (err, result) {
      if (err) throw (err);
      db.close();
      var bericht = result.naam + " " + result.score
      return bot.sendMessage(msg.from.id, bericht);
    });
  });
});

bot.start();
