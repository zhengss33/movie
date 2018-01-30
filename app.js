const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const bodyParser = require('body-parser');
const Movie = require('./models/movie');
const User = require('./models/user');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://127.0.0.1/movie');

app.set('views', './views/pages');
app.set('view engine', 'pug');
app.use(bodyParser());
app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);

// 首页
app.get('/', (req, res) => {
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
});

// 详情页
app.get('/movie/:id', (req, res) => {
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
});

// 后台录入页
app.get('/admin/movie', (req, res) => {
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
});

// admin update movie
app.get('/admin/update/:id', (req, res) => {
  let id = req.params.id;

  if (id) {
    Movie.findById(id, (err, movie) => {
      res.render('admin', {
        title: 'movie 后台更新',
        movie,
      });
    });
  }
})

// add movie
app.post('/admin/movie/new', (req, res) => {
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
});

// userlist
app.get('/admin/userlist', (req, res) => {
  User.fetch((err, users) => {
    if (err) {
      console.log(err);
    } else {
      res.render('userlist', {
        title: '用户列表',
        users,
      });
    }
  })
})


// 列表页
app.get('/admin/list', (req, res) => {
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
});


// 删除电影
app.delete('/admin/list', (req, res) => {
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
});

// signup
app.post('/user/signup', (req, res) => {
  let _user = req.body.user;

  User.findOne({ name: _user.name }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (!user) {
        const user = new User(_user);
        user.save((err, user) => {
          if (err) {
            console.log(err);
          }
          res.redirect('/admin/userlist');
        });
      } else {
        res.status = 500;
        res.end('Username already exist');
      }
    }
  });
})

// signin
app.post('/user/signin', (req, res) => {
  const _user = req.body.user;
  const name = _user.name;
  const password = _user.password;

  User.findOne({ name }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (!user) {
        res.status = 404;
        res.end('User does not exist')
      } else {
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            console.log(err);
            return;
          }

          if (isMatch) {
            console.log('matched');
            res.redirect('/');
          } else {
            res.status = 500;
            res.end('Password is not matched');
          }
        })
      }
    }
  })
});

console.log('Server running at port 3000');
