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

var saveWeather = (data => {

  let firstTemp = function(data){
    let a = data.dwml.data[0].parameters[0].temperature[0].name[0];
    if (a === 'Daily Maximum Temperature') {
      return data.dwml.data[0].parameters[0].temperature[0].value[0];
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
    // UNCOMMENT THESE TWO LINES TO FAKE HISTORICAL DATA
    // timeStart: "2017-11-01T07:00:00-06:00",
    // timeEnd: "2017-11-01T19:00:00-06:00",
    timeStart: data.dwml.data[0]['time-layout'][0]['start-valid-time'][0], // begin
    timeEnd: data.dwml.data[0]['time-layout'][0]['end-valid-time'][0], //end
    tempMax: firstTemp(data),
    tempMin: secondTemp(data),
    forecastURL: data.dwml.data[0].moreWeatherInformation[0]['_']
  };

  var weather = new Weather(incomingWeather);

  return weather.save();
});

var retrieveWeather = function(zipcode) {
  if (typeof zipcode === 'object' ){
    return Weather.find({'zipcode': zipcode.zipcode});
  } else {
    return Weather.find({'zipcode': zipcode});
  }
};

module.exports.saveWeather = saveWeather;
module.exports.retrieveWeather = retrieveWeather;