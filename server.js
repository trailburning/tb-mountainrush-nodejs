var express = require('express');
var routes = require('./routes/index.js');
var path = require('path');

var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use('/static-assets',express.static(__dirname + '/static-assets'));

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8000;

routes(app);

app.listen(PORT, () => console.log('Listening on ' + PORT));
