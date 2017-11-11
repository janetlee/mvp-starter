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

    helpers.getNWSData(req.body)
      .then((body) => {
        console.log('NWS data received');
        setTimeout(function() {
          XMLParser(body, function (err, result) {
            console.log('INSIDE THE PARSER');
            console.log('LAT', result.dwml.data[0].location[0].point[0]['$']['latitude']);
            console.log('LONG', result.dwml.data[0].location[0].point[0]['$']['longitude']);
   //         console.log('MOREWEATHER INFO: ', result.dwml.data[0].moreWeatherInformation);
            console.log('STARTTIME', result.dwml.data[0]['time-layout'][0]['start-valid-time']);
            console.log('ENDTIME', result.dwml.data[0]['time-layout'][0]['end-valid-time']);
            console.log('TempName', result.dwml.data[0].parameters[0].temperature[0].name);
            console.log('TempValue', result.dwml.data[0].parameters[0].temperature[0].value);
          })
        }, 0);

        // items.saveWeather(body);
        // parse this data
        // save this data to db
      })
      .catch(() => {
        console.log('handling promise rejection');
      });

    res.status(201).send('Received POST');
  }
}));

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

