var express = require('express');
var routes = require('./routes/index.js');
var path = require('path');

var app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/static-assets', express.static(__dirname + '/static-assets'));

app.use(function(err, req, res, next) {
  // Do logging and user-friendly error message display
  console.error(err);
  res.status(500).send();
});

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8000;

routes(app);

app.listen(PORT, () => console.log('Listening on ' + PORT));
