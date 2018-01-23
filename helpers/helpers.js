// National Weather Service & Google Maps helpers
var config = require('../config');
var express = require('express');
var moment = require('moment');
var Promises = require('bluebird');
var request = require('request');
var XMLParser = require('xml2js').parseString;
var underscore = require('underscore');
var now = moment();
var dateToday = (now.format("YYYY-MM-DDTHH:mm:ss"));
var dateTomorrow = (moment(dateToday).add(1, 'day').format("YYYY-MM-DDTHH:mm:ss"));

module.exports.getNWSData = function(body) {
  let options = {
    url: 'https://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?zipCodeList='
        + body.zipcode
        + '&product=time-series&begin='
        + dateToday + '&end='
        + dateTomorrow + '&maxt=maxt&mint=mint',
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${config.NWSTOKEN}`
    }
  };

  // pass the requst options to the request in a Promise
  return new Promise ((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Inside the Weather promise');
        resolve(body);
      }
    })
  })
};

module.exports.getGeocoding = function(body) {
  let options = {
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + body.zipcode + '&key=' + config.GoogleMAPS_API_KEY,
    headers: {
      'User-Agent': 'request'
    }
  };

  return promiseStructure(options, 'Inside the Geocode promise');
};

module.exports.getStaticMap = function(latlong) {
  let options = {
    url: 'https://maps.googleapis.com/maps/api/staticmap/?center=' + latlong +
    'zoom=14&size=400x400&key=' + config.StaticMap_API_KEY,
    headers: {
      'User-Agent': 'request'
    }
  };

  return promiseStructure(options, 'Inside the Map promise');
};

const promiseStructure = function(options, logMessageString) {
  return new Promise ((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log(logMessageString);
        body = JSON.parse(body);
        resolve(body);
      }
    })
  })
};

const XMLParse = function(body, geocodeBody) {
  return new Promise ((resolve, reject) => {
    XMLParser(body, function (err, weatherBody) {
      if (err) {
        reject(err, 'ERROR INSIDE THE PARSER');
      } else {
        resolve(underscore.extend(weatherBody, geocodeBody));
      }
    })
  })
};

module.exports.promiseStructure = promiseStructure;
module.exports.XMLParse = XMLParse;
module.exports.getLastRecord = (data => data[data.length-1]);