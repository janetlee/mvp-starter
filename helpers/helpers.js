// National Weather Service helpers
var config = require('../config');
var express = require('express');
var Promises = require('bluebird');
var request = require('request');

module.exports.getNWSData = function(body) {
  let options = {
    url: 'https://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?zipCodeList='
        + body.zipcode
// TODO: Need to parse for date things to enter today's date
        + '&product=time-series&begin=2017-10-10T00:00:00&end=2017-11-11T00:00:00&maxt=maxt&mint=mint'
        ,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${config.NWSTOKEN}`
    }
  };

  console.log(options);
  // pass the requst options to the request in a Promise
  return new Promise ((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Inside the Weather promise');
        setTimeout(() => {resolve(body)},10);
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

  console.log(options);
  return new Promise ((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Inside the Geocode promise');
        body = JSON.parse(body);
        resolve(body);
      }
    })
  })
};