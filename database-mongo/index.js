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
  lat: { type: String, required: true},
  long: { type: String, required: true},
  timeStart: { type: String, required: true},
  timeEnd: { type: String, required: true},
  tempType: { type: Number, required: true},
  temp: { type: Number, required: true}
  // TODO: CREATE UNIQUE COMPOSITE INDEX
});

let geocodeSchema = mongoose.Schema({
  zipcode: { type: String, required: true},
  lat: { type: String, required: true},
  long: { type: String, required: true}
  // TODO: CREATE UNIQUE COMPOSITE INDEX
});

let Weather = mongoose.model('Weather', weatherSchema);
let Geocode = mongoose.model('Geocode', geocodeSchema);

var saveWeather = ((data) => {

  var incomingData = {
    lat: result.dwml.data[0].location[0].point[0]['$']['latitude'],
    long: result.dwml.data[0].location[0].point[0]['$']['longitude'],
    timeStart: result.dwml.data[0]['time-layout'][0]['start-valid-time'], // begin
    timeEnd: result.dwml.data[0]['time-layout'][0]['end-valid-time'], //end
    tempType: result.dwml.data[0].parameters[0].temperature[0].name,
    temp: result.dwml.data[0].parameters[0].temperature[0].value
  };

  var weather = new Weather(incomingData);
  weather.save()
  .then(data => {
    console.log("Weather saved to database");
  })
  .catch(err => {
    console.log(err);
    console.log("unable to save to database");
  });
});


var retrieveWeather = function(callback) {
  Weather.find({}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

module.exports.saveWeather = saveWeather;
module.exports.retrieveWeather = retrieveWeather;