const Index = require('../app/routes/index');
const Movie = require('../app/routes/movie');
const User = require('../app/routes/user');
const Comment = require('../app/routes/comment');
const Category = require('../app/routes/category');
const Search = require('../app/routes/search');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dest = path.join(__dirname, '../public/upload');
    cb(null, dest);
  },
  filename(req, file, cb) {
    const type = file.mimetype.split('/')[1];
    cb(null, `${file.fieldname}-${Date.now()}.${type}`);
  },
});
const upload = multer({
  storage: storage,
});

module.exports = function(app) {
  // pre handle user session
  app.use((req, res, next) => {
    app.locals.user = req.session.user || '';
    next();
  });

  // index
  app.get('/', Index.index);

  // search-result
  app.get('/result', Search.result)

  // movie
  app.get('/movie/:id', Movie.detail);

  // admin
  // movie
  app.get('/admin/movie', User.signinRequire, User.adminRequire, Movie.new);
  app.post('/admin/movie/new', User.signinRequire, User.adminRequire, upload.single('uploadPoster'), Movie.save);
  app.get('/admin/movie/update/:id', User.signinRequire, User.adminRequire, Movie.update);
  app.delete('/admin/movie/list', User.signinRequire, User.adminRequire, Movie.delete);
  app.get('/admin/movie/list', User.signinRequire, User.adminRequire, Movie.list);
  // user
  app.get('/admin/user/list', User.signinRequire, User.adminRequire, User.list);
  // category
  app.get('/admin/category', User.signinRequire, User.adminRequire, Category.new);
  app.post('/admin/category', User.signinRequire, User.adminRequire, Category.save);
  app.get('/admin/category/list', User.signinRequire, User.adminRequire, Category.list);

  // user
  app.get('/logout', User.logout);
  app.get('/signup', User.toSignup);
  app.get('/signin', User.toSignin);
  app.post('/signup', User.signup);
  app.post('/signin', User.signin);

  // comments
  app.post('/movie/comment', User.signinRequire, Comment.save);
}
