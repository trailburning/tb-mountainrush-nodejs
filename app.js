var express = require('express');
var app = express();
var path = require('path');

app.set('view engine', 'ejs');

const DATABASE_URL = process.env.CLEARDB_DATABASE_URL || 'empty'
const PORT = process.env.PORT || 3000

// viewed at http://localhost:3000
app.get('/', function(req, res) {
  var user = new Object();
  user.firstname  = 'Matt';
  user.lastname  = 'Allbeury';
  user.db = DATABASE_URL;

  res.render('index', {user: user});
});

app.listen(PORT, () => console.log('Listening on ' + PORT));
