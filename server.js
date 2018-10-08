var express = require('express');
var i18n = require("i18n");
var routes = require('./routes/index.js');
var path = require('path');

i18n.configure({
  locales:['en', 'de'],
  directory: __dirname + '/locales'
});

var app = express();

app.use(i18n.init);
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/static-assets', express.static(__dirname + '/static-assets'));

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8000;

routes(app);

app.listen(PORT, () => console.log('Listening on ' + PORT));
