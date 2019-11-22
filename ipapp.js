// var geoip = require('geoip-lite');

// var ip = "155.93.232.169";
// var geo = geoip.lookup(ip);

// console.log(geo);

// const iplocation = require("iplocation").default;
 
// iplocation('155.93.207.245', [], (error, res) => {
//     console.log(res);
// });

// var NodeGeocoder = require('node-geocoder');

// var options = {
//   provider: 'google',

//   // Optional depending on the providers
//   httpAdapter: 'https', // Default
//   apiKey: 'AIzaSyAxdwnqjWNL8FzlEYk7RAXGaaDW52vO2V4', // for Mapquest, OpenCage, Google Premier
//   formatter: null         // 'gpx', 'string', ...
// };

// var geocoder = NodeGeocoder(options);

// Using callback
// geocoder.geocode('29 champs elysée paris', function(err, res) {
//     console.log(res);
//   });
// geocoder.reverse({lat:-26.0941, lon:28.0012})
//   .then(function(res) {
//     console.log(res);
//   })
//   .catch(function(err) {
//     console.log(err);
//   });
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAxdwnqjWNL8FzlEYk7RAXGaaDW52vO2V4'
  });

  googleMapsClient.reverseGeocode(LatLng[-26.0941, 28.0012], function(err, response) {
    if (!err) {
      console.log(response.json.results);
    }
  });