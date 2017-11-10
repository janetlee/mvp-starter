var express = require('express');
var bodyParser = require('body-parser');
var items = require('../database-mongo');

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


// Internal get call
app.get('/items', function (req, res) {
  items.selectAll(function(err, data) {
    if(res === undefined) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.post('/items', ((req, res, next) => {
  if (!req) {
    res.status(500).send('Bad request');
  } else {
    console.log('Received POST call data: ', req.body);
    res.status(201).send('Received POST');

    // Call the NWS helpers file and do the API call.
  }
}));

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

