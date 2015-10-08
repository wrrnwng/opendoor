var url = require('url');
var querystring = require('querystring');
var geoJSON = require('geojson');
var db = require('./db');

module.exports = function(req, res) {
  var parsedUrl = url.parse(req.url);
  var pathname = parsedUrl.pathname;
  var query = querystring.parse(parsedUrl.query);

  // mongoose query options
  var options = {};
  var priceRange = {};
  var bedRange = {};
  var bathRange = {};

  for (var key in query) {
    if (key === 'min_price') {
      priceRange.$gte = query[key];
      options.price = priceRange;

    } else if (key === 'max_price') {
      priceRange.$lte = query[key];
      options.price = priceRange;

    } else if (key === 'min_bed') {
      bedRange.$gte = query[key];
      options.bedrooms = bedRange;

    } else if (key === 'max_bed') {
      bedRange.$lte = query[key];
      options.bedrooms = bedRange;

    } else if (key === 'min_bath') {
      bathRange.$gte = query[key];
      options.bathrooms = bathRange;

    } else if (key === 'max_bath') {
      bathRange.$lte = query[key];
      options.bathrooms = bathRange;
    }
  }

  if (pathname === '/listings') {
    db.Listing.find(options)
      .select('-_id -__v') // removes mongodb specific properties
      .exec(function(err, listings) {
        if (err) {
          console.error(err);
        } else {
          // output included unresolved promises
          // had to convert to JSON string to rid excess
          // promise related object properties
          var listingsJSON = JSON.stringify(listings);
          var geoJSONListings = geoJSON.parse(JSON.parse(listingsJSON), {Point: ['lat', 'lng']});
          res.end(JSON.stringify(geoJSONListings));
        }
      });
  } else {
    res.end('No route here. Try /listings');
  }
};
