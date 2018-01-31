const Movie = require('../models/movie');
const _ = require('lodash');

// movie detail
exports.detail = function(req, res) {
  const id = req.params.id;

  Movie.findById(id, (err, movie) => {
    if (err) {
      console.log(err);
    } else {
      res.render('detail', {
        title: `movie ${movie.title}`,
        movie,
      });
    }
  });
}

// 后台录入页
exports.new = function(req, res) {
  res.render('admin', {
    title: 'movie 后台录入页',
    movie: {
      title: '',
      director: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: '',
    },
  });
}

// add movie
exports.save = function(req, res) {
  const movieObj = req.body.movie;
  const id = movieObj._id;
  let _movie;

  if (id) {
    Movie.findById(id, (err, movie) => {
      if (err) {
        console.log(err);
      } else {
        _movie = _.assign(movie, movieObj);
        _movie.save((err, movie) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect(`/movie/${movie._id}`);
          }
        });
      }
    });
  } else {
    _movie = new Movie({
      director: movieObj.director,
      title: movieObj.title,
      language: movieObj.language,
      country: movieObj.country,
      summary: movieObj.summary,
      flash: movieObj.flash,
      poster: movieObj.poster,
      year: movieObj.year,
    });

    _movie.save((err, movie) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`/movie/${movie._id}`)
      }
    });
  }
}

// admin update movie
exports.update = function(req, res){
  let id = req.params.id;

  if (id) {
    Movie.findById(id, (err, movie) => {
      res.render('admin', {
        title: 'movie 后台更新',
        movie,
      });
    });
  }
}

// 删除电影
exports.delete = function(req, res) {
  let id = req.query.id;

  if (id) {
    Movie.remove({ _id: id }, (err, movie) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ success: true });
      }
    });
  } else {
    res.statusCode = 500;
    res.end('id is invalid')
  }
}

// 列表页
exports.list = function(req, res) {
  Movie.fetch((err, movies) => {
    if (err) {
      console.log(err);
    } else {
      res.render('list', {
        title: 'movie 电影列表',
        movies,
      })
    }
  });
}
