var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mvpproject', {useMongoClient: true});

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

let weatherSchema = mongoose.Schema({
  zipcode: { type: String, required: true},
  timeStart: { type: String, required: true},
  timeEnd: { type: String, required: true},
  tempMax: { type: Number, required: false},
  tempMin: { type: Number, required: true},
  forecastURL: { type: String, required: false}
  // TODO: CREATE UNIQUE COMPOSITE INDEX
});

let Weather = mongoose.model('Weather', weatherSchema);

var saveWeather = ((data, callback) => {
  console.log('Inside saveWeather');

  let firstTemp = function(data){
    let a = data.dwml.data[0].parameters[0].temperature[0].name[0];
    if (a === 'Daily Maximum Temperature') {
      return data.dwml.data[0].parameters[0].temperature[0].value[1];
    } else {
      return null;
    }
  };

  let secondTemp = function(data){
    let a = data.dwml.data[0].parameters[0].temperature[0].name[0];
    if (a === 'Daily Minimum Temperature') {
      return data.dwml.data[0].parameters[0].temperature[0].value[0];
    } else {
      return data.dwml.data[0].parameters[0].temperature[1].value[0];
    }
  };

  var incomingWeather = {
    zipcode: data.results[0]['address_components'][0]['long_name'],
    timeStart: data.dwml.data[0]['time-layout'][0]['start-valid-time'][0], // begin
    timeEnd: data.dwml.data[0]['time-layout'][0]['end-valid-time'][0], //end
    tempMax: firstTemp(data),
    tempMin: secondTemp(data),
    forecastURL: data.dwml.data[0].moreWeatherInformation[0]['_']
  };

  var weather = new Weather(incomingWeather);

  weather.save()
    .then(data => {
      console.log("Weather saved to database");
      callback(null, data);
    })
    .catch(err => {
      console.log(err);
      console.log("unable to save to database");
    });
});

var retrieveWeather = function(zipcode, callback) {
  console.log('INSIDE WEATHER RETRIEVAL METHOD');
  Weather.find({'zipcode': zipcode}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

module.exports.saveWeather = saveWeather;
module.exports.retrieveWeather = retrieveWeather;