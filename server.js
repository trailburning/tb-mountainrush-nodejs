var express = require('express');
var cookieParser = require('cookie-parser')
var i18n = require("i18n");
var routes = require('./routes/index.js');
var path = require('path');

i18n.configure({
  locales:['en', 'de', 'fr'],
  directory: __dirname + '/locales',
  cookie: 'mountainrush_lang',
  objectNotation: true,
  autoReload: true, // while translating
  updateFiles: true // while translating
});

// use .env for dev use
if (process.env.NODE_ENV != "staging" && process.env.NODE_ENV != "production") {
  console.log('dotenv');
  require('dotenv').config();
}

var app = express();

app.use(cookieParser());
app.use(i18n.init);
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/static-assets', express.static(__dirname + '/static-assets'));

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8000;

routes(app);

app.listen(PORT, () => console.log('Listening on ' + PORT));
