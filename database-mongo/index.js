var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mvpproject');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var itemSchema = mongoose.Schema({
  zipcode: { type: String, required: true},
  timeStart: { type: Date, required: true},
  timeEnd: { type: Date, required: true},
  tempMax: { type: Number, required: true},
  tempMin: { type: Number, required: true}
  // TODO: CREATE UNIQUE COMPOSITE INDEX
});

var Item = mongoose.model('Item', itemSchema);

var selectAll = function(callback) {
  Item.find({}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

module.exports.selectAll = selectAll;