var https = require('https');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/opendoor');

var Listing = mongoose.model('Listing', {
  id: Number,
  street: String,
  status: String,
  price: Number,
  bedrooms: Number,
  bathrooms: Number,
  sq_ft: Number,
  lat: Number,
  lng: Number
});

// updates mongodb from csv file
https.get('https://s3.amazonaws.com/opendoor-problems/listings.csv', function(res) {
  var str = '';

  res.on('data', function(chunk) {
    str += chunk;
  });

  res.on('end', function() {
    var values = str.split('\n');
    values.pop(); // gets rid of newline at end
    var keys = values.shift().split(',');
    values.forEach(function(value) {
      var listingProps = value.split(',');
      var listing = {};
      keys.forEach(function(key, i) {
        listing[key] = listingProps[i];
      });

      // upsert will insert if doc not found, update otherwise
      Listing.findOneAndUpdate({id: listing.id}, listing, {upsert: true}, function(err) {
        if (err) {
          console.error(err);
        }
      });
    });
  });
});

module.exports.Listing = Listing;
