const Movie = require('../models/movie');
const Comment = require('../models/comment');
const Category = require('../models/category');
const _ = require('lodash');;

// movie detail
exports.detail = function(req, res) {
  const id = req.params.id;

  Movie.update({ '_id': id }, {$inc: { pv: 1 }}, (err) => {
    if (err) {
      console.log(err);
    }
  });

  Movie.findById(id, (err, movie) => {
    if (err) {
      console.log(err);
    } else {
      Comment
        .find({ movie: id })
        .populate('from', 'name')
        .populate('reply.from reply.to', 'name')
        .exec((err, comments) => {
          res.render('detail', {
            title: `movie ${movie.title}`,
            movie,
            comments,
          });
        });
    }
  });
}

// 后台录入页
exports.new = function(req, res) {
  Category.fetch((err, categories) => {
    if (err) {
      console.log(err);
    } else {
      res.render('admin', {
        title: 'movie 后台录入页',
        movie: {},
        categories,
      });
    }
  });
}

// add movie
exports.save = function(req, res) {
  const movieObj = req.body.movie;
  const id = movieObj._id;
  const file = req.file;
  let _movie;

  if (file) {
    movieObj.poster = file.filename;
  }

  if (id) {
    Movie.findById(id, (err, movie) => {
      if (err) {
        console.log(err);
      } else {
        Category.update(
          { '_id': movie.category },
          { '$pull': { 'movies': id } }, (err, category) => {
            if (err) {
              return console.log(err);
            }
            _movie = _.assign(movie, movieObj);
            _movie.save((err, movie) => {
              if (err) {
                console.log(err);
              } else {
                Category.findById(movie.category, (err, category) => {
                  category.movies.push(movie._id);
                  category.save((err, category) => {
                    if (err) {
                      return console.log(err);
                    }
                    res.redirect(`/movie/${movie._id}`);
                  });
                })
              }
            });
          })
      }
    });
  } else {
    console.log('new');
    _movie = new Movie(movieObj);

    _movie.save((err, movie) => {
      if (err) {
        console.log(err);
      } else {
        Category.findById(movie.category, (err, category) => {
          category.movies.push(movie._id);
          category.save((err, category) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect(`/movie/${movie._id}`);
            }
          })
        })
      }
    });
  }
}

// admin update movie
exports.update = function(req, res){
  let id = req.params.id;

  if (id) {
    Movie.findById(id, (err, movie) => {
      if (err) {
        return console.log(err);
      }
      Category.fetch((err, categories) => {
        if (err) {
          return console.log(err);
        }
        res.render('admin', {
          title: 'movie 后台更新',
          movie,
          categories,
        });
      })
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
      res.render('admin-movies', {
        title: 'movie 电影列表',
        movies,
      })
    }
  });
}
