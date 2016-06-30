var User = require("../models/user");
var request = require('request');

function splash(req, res, next){
  res.render('splash');
};

function index(req, res, next){
  if (req.user) {
    var options = {
      url: 'https://api.spotify.com/v1/me/top/artists?limit=50',
      headers: {'Authorization': 'Bearer ' + req.user.accessToken}
    };
    // get artists array and map into array of objects with just name and image url
    request.get(options, function(err, resp, body) {
      var venuePromises = [];
      var artists = artistData(JSON.parse(body).items);
      console.log(req.session.location);
      if (req.session.location) {
        var userLat = req.session.location.lat;
        var userLng = req.session.location.lng;
      } else {
        var userLat = 45.5231;
        var userLng = -122.6765;
      };
      artists.forEach(function(artist) {
        var artistName = artist.name.replace(/&/g,'and').split(' ').join('');
        console.log(req.session.location);


          var url = `http://api.bandsintown.com/artists/${artistName}/events/search.json?api_version=2.0&app_id=concertmatch&location=${userLat},${userLng}&radius=50`;


        venuePromises.push(
          new Promise(function(resolve, reject){
            request.get(url, function(err, response, body) {
              var venues = JSON.parse(body);
              if (venues.length >= 1) {
                artist.concerts = [];
                venues.forEach(venue => artist.concerts.push(venue));
              }
              resolve(artist);
            });
          })
        );
      });
      Promise.all(venuePromises).then(function(returnedArtists){
        // console.log("ARGS", returnedArtists);
        // console.log("LOC", req.session.location);
        res.render('index', { user: req.user, artists: artists, lat: userLat, lng: userLng });
      });
    });
  } else {
    res.redirect('/login');
  }
};


function artistData(artists) {
  return artists.map(function(artist) {
    return {
      name: artist.name,
      image: artist.images[0].url
    }
  });
}

function update(req, res, next) {
  if (req.body.name)  req.user.name = req.body.name;
  if (req.body.photo) req.user.photo = req.body.photo;
  req.user.save(function(err, user) {
    res.json(req.user);
  });
}

module.exports = {
  index  :  index,
  update :  update,
  splash :  splash
};



