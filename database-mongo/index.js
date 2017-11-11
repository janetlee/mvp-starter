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
  lat: { type: Number, required: true},
  long: { type: Number, required: true},
  timeStart: { type: String, required: true},
  timeEnd: { type: String, required: true},
  tempType: { type: String, required: true},
  temp: { type: Number, required: true}
  // TODO: CREATE UNIQUE COMPOSITE INDEX
});

let geocodeSchema = mongoose.Schema({
  zipcode: { type: String, required: true, unique: true},
  lat: { type: String, required: true},
  long: { type: String, required: true}
});

let Weather = mongoose.model('Weather', weatherSchema);

var saveWeather = ((data) => {
  console.log('Inside saveWeather');
  console.log(data.dwml.data[0].location[0].point[0]['$']['latitude']);

  var incomingWeather = {
    lat: data.dwml.data[0].location[0].point[0]['$']['latitude'],
    long: data.dwml.data[0].location[0].point[0]['$']['longitude'],
    timeStart: data.dwml.data[0]['time-layout'][0]['start-valid-time'][0], // begin
    timeEnd: data.dwml.data[0]['time-layout'][0]['end-valid-time'][0], //end
    tempType: data.dwml.data[0].parameters[0].temperature[0].name[0],
    temp: data.dwml.data[0].parameters[0].temperature[0].value[0]
  };

  console.dir(incomingData);

  var weather = new Weather(incomingWeather);
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

let Geocode = mongoose.model('Geocode', geocodeSchema);

var saveGeocode = ((body) => {
  console.log('Inside saveGeocode');

  var incomingGeocode = {
    zipcode: body['results'][0]['address_components'][0]['long_name'],
    lat: body['results'][0]['geometry']['location']['lat'],
    long: body['results'][0]['geometry']['location']['lng']
  };

  console.dir(incomingGeocode);

  var geocode = new Geocode(incomingData);
    geocode.save()
    .then(data => {
      console.log("Geocode saved to database");
    })
    .catch(err => {
      console.log(err);
      console.log("unable to save Geocode to database");
    });
});


var retrieveGeocode = function(callback) {
  Geocode.find({}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};


module.exports.saveWeather = saveWeather;
module.exports.retrieveWeather = retrieveWeather;
module.exports.saveGeocode = saveGeocode;
module.exports.retrieveGeocode = retrieveGeocode;