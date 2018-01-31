const Movie = require('../models/movie');

// index
exports.index = function(req, res) {
  Movie.fetch((err, movies) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'movie 首页',
        movies,
      });
    }
  });
}
