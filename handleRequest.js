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
    var subset = db.Listing.find(options);
    subset.select('-_id -__v') // removes mongodb specific properties
      .then(function(listings) {
        res.end(JSON.stringify(geoJSON.parse(listings, {Point: ['lat', 'lng']})));
      });
  } else {
    res.end('No route here. Try /listings');
  }
};
