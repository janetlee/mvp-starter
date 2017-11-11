var express = require('express');
var bodyParser = require('body-parser');
var items = require('../database-mongo');
var helpers = require('../helpers/helpers.js');
var XMLParser = require('xml2js').parseString;

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded()); // text/xml


// Internal get call
app.get('/items', function (req, res) {
  items.retrieveWeather(function(err, data) {
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

    helpers.getGeocoding(req.body)
      .then((body) => {
        console.log('Sending Geocode to DB');
        items.saveGeocode(body);
      })
      .catch(() => {
        console.log('handling promise rejection on Geocode data write');
      });

// TEMPORARILY DISABLING NWS CALLS
    // helpers.getNWSData(req.body)
    //   .then((body) => {
    //     console.log('NWS data received');
    //     // setTimeout(function() {
    //     XMLParser(body, function (err, result) {
    //       console.log('INSIDE THE PARSER');
    //       items.saveWeather(result);
    //     });
    //   })
    //   .catch(() => {
    //     console.log('handling promise rejection on NWS data write');
    //   });

    res.status(201).send('Received POST');
  }
}));

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

