var express = require('express');
var bodyParser = require('body-parser');
var items = require('../database-mongo');
var helpers = require('../helpers/helpers.js');
// var XMLParser = require('xml2js').parseString;
// var underscore = require('underscore');
var Promises = require('bluebird');
var moment = require('moment');
var helmet = require('helmet');

// Promises.promisify(XMLParser);

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

    return new Promise ((resolve, reject) => {
      items.retrieveWeather(req.body.zipcode, function (err, data) {
        if (err) {
          reject({message: err, location: 'Dying in retrieveWeather invocation'});
        } else {
          console.log('RETRIEVE DATA INSIDE ORIGINAL PROMISE', data);
          resolve(data);
        }
      })
    })
    .then((data) => {
      if (data.length === 0) {
        console.log('go fetch data from API');
        helpers.getGeocoding(req.body)
          .then((body) => {
            geocodeBody = body;

            helpers.getNWSData(req.body)
              .then((body) => helpers.XMLParse(body, geocodeBody))
              .then((result) => {
                console.log('PARSED TEXT TO PASS TO SAVE FUNCTION', result);
                return new Promise ((resolve, reject) => {
                  items.saveWeather(result, function (err, zipcode) {
                    if (err) {
                      reject({message: err, location: 'Dying in saveWeather invocation'});
                    } else {
                      console.log(result.results[0]['address_components'][0]['long_name']);
                      resolve(result.results[0]['address_components'][0]['long_name']);
                    }
                  })
                })
              })
              .then((zipcode) => {
                console.log('LOGGING INCOMING ZIP BEFORE RETRIEVAL', zipcode);
                return new Promise ((resolve, reject) => {
                  items.retrieveWeather(zipcode, function (err, data) {
                    if (err) {
                      reject({message: err, location: 'Dying in retrieveWeather invocation'});
                    } else {
                      console.log('RETRIEVAL DATA', data);
                      resolve(data);
                    }
                  })
                })
              })
              .then((data) => {
                console.log('DATA BEFORE SENDING OUT',  data);
                res.status(201).send(data);
              })
            .catch((err) => {
              console.log(err.message, err.location);
              console.log('handling promise rejection on NWS data write');
            });
          })
          .catch((err) => {
            console.log(err);
            console.log('handling promise rejection on Geocode data write');
          });
      } else {
        let dateOnRecord = data[data.length-1].timeEnd.slice(0,19);
        var now = moment();
        var dateToday = (now.format("YYYY-MM-DDTHH:mm:ss[Z]"));
        // console.log('dateToday:        ', dateToday);
        // console.log('date from the DB: ', dateOnRecord);
        if (dateToday > dateOnRecord) {
          console.log('NEEDS NEWER DATA');
          helpers.getGeocoding(req.body)
            .then((body) => {
              geocodeBody = body;

              helpers.getNWSData(req.body)
                .then((body) => {
                  return new Promise ((resolve, reject) => {
                    XMLParser(body, function (err, result) {
                      if (err) {
                        reject(err);
                      } else {
                        console.log('INSIDE THE PARSER');
                        weatherBody = result;
                        resolve(underscore.extend(result, geocodeBody));
                      }
                    })
                  })
                })
                .then((result) => {
                  // console.log('PARSED TEXT TO PASS TO SAVE FUNCTION', result);
                  return new Promise ((resolve, reject) => {
                    items.saveWeather(result, function (err, zipcode) {
                      if (err) {
                        reject({message: err, location: 'Dying in saveWeather invocation'});
                      } else {
                        console.log(result.results[0]['address_components'][0]['long_name']);
                        resolve(result.results[0]['address_components'][0]['long_name']);
                      }
                    })
                  })
                })
                .then((zipcode) => {
                  console.log('LOGGING INCOMING ZIP BEFORE RETRIEVAL', zipcode);
                  return new Promise ((resolve, reject) => {
                    items.retrieveWeather(zipcode, function (err, data) {
                      if (err) {
                        reject({message: err, location: 'Dying in retrieveWeather invocation'});
                      } else {
                        console.log('RETRIEVAL DATA', data);
                        resolve(data);
                      }
                    })
                  })
                })
                .then((data) => {
                  console.log('DATA BEFORE SENDING OUT',  data);
                  let currentRecord = helpers.getLastRecord(data);
                  console.log('Log the currentRecord: ', currentRecord);
                  res.json(currentRecord);
                  res.status(201);
                })
              .catch((err) => {
                console.log(err.message, err.location);
                console.log('handling promise rejection on NWS data write');
              });
            })
            .catch((err) => {
              console.log(err);
              console.log('handling promise rejection on Geocode data write');
            });
        } else {
          console.log('Returning Data for Screen Render');
            console.log(data[data.length-1]);
            let currentRecord = helpers.getLastRecord(data);
            res.json(currentRecord);
            res.status(201);
        }
      }
    });

  }
}));

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

