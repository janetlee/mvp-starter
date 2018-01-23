var bodyParser = require('body-parser');
var express = require('express');
var helmet = require('helmet');
var helpers = require('../helpers/helpers.js');
var items = require('../database-mongo');
var moment = require('moment');
var Promises = require('bluebird');
var underscore = require('underscore');
var XMLParser = require('xml2js').parseString;

var app = express();

app.use(helmet());
app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.get('/items', function (req, res) {
  items.retrieveWeather(req.body, function(err, data) {
    if(res === undefined) {
      res.sendStatus(500);
    } else {
      console.log('WEATHER DATA INSIDE GET CALL', data);
      if (data) {
        res.json(data[data.length-1]);
      }
    }
  });
});

app.post('/items', ((req, res, next) => {
  if (!req) {
    res.status(500).send('Bad request');
  } else {
    console.log('Received POST on Server', req.body);
    return items.retrieveWeather(req.body.zipcode)
    .then(data => {
      if (data.length === 0) {
          console.log('go fetch data from API');
          helpers.getGeocoding(req.body)
            .then((body) => {
              geocodeBody = body;

              helpers.getNWSData(req.body)
                .then(body => helpers.XMLParse(body, geocodeBody) )
                .then(result => items.saveWeather(result))
                .then(data => items.retrieveWeather(data.zipcode))
                .then(data => res.status(201).send(data))
                .catch(err => {
                  console.log(err.message, err.location);
                  console.log('handling promise rejection on NWS data write 1');
                })
            })
            .catch(err => {
              console.log(err);
              console.log('handling promise rejection on Geocode data write');
            });
      } else {
        let dateOnRecord = data[data.length-1].timeEnd.slice(0,19);
        var now = moment();
        var dateToday = (now.format("YYYY-MM-DDTHH:mm:ss[Z]"));

        if (dateToday > dateOnRecord) {

          helpers.getGeocoding(req.body)
            .then((body) => {
              geocodeBody = body;

              helpers.getNWSData(req.body)
                .then(body => helpers.XMLParse(body, geocodeBody))
                .then(result => items.saveWeather(result))
                .then(zipcode => items.retrieveWeather(zipcode))
                .then(data => {
                  let currentRecord = helpers.getLastRecord(data);
                  res.json(currentRecord);
                  res.status(201);
                })
                .catch(err => {
                  console.log(err.message, err.location);
                  console.log('handling promise rejection on NWS data write 2');
                });
              })
            .catch(err => {
              console.log(err);
              console.log('handling promise rejection on Geocode data write');
            });
        } else {
          console.log(data[data.length-1]);
          let currentRecord = helpers.getLastRecord(data);
          res.json(currentRecord);
          res.status(201);
        }
      }
    })
  }
}));

app.listen(3000, function() {
  console.log('listening on port 3000!');
});