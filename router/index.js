const Index = require('../app/routes/index');
const Movie = require('../app/routes/movie');
const User = require('../app/routes/user');
const Comment = require('../app/routes/comment');

module.exports = function(app) {
  // pre handle user session
  app.use((req, res, next) => {
    app.locals.user = req.session.user || '';
    next();
  });

  // index
  app.get('/', Index.index);

  // movie
  app.get('/movie/:id', Movie.detail);

  // admin
  app.get('/admin/movie', User.signinRequire, User.adminRequire, Movie.new);
  app.post('/admin/movie/new', User.signinRequire, User.adminRequire, Movie.save);
  app.get('/admin/movie/update/:id', User.signinRequire, User.adminRequire, Movie.update);
  app.delete('/admin/movie/list', User.signinRequire, User.adminRequire, Movie.delete);
  app.get('/admin/movie/list', User.signinRequire, User.adminRequire, Movie.list);
  app.get('/admin/user/list', User.signinRequire, User.adminRequire, User.list);

  // user
  app.get('/logout', User.logout);
  app.get('/signup', User.toSignup);
  app.get('/signin', User.toSignin);
  app.post('/signup', User.signup);
  app.post('/signin', User.signin);

  // comments
  app.post('/movie/comment', User.signinRequire, Comment.save);
}
