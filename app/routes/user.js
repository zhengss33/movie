const User = require('../models/user');

// userlist
exports.list = function(req, res) {
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
}


// signup
exports.toSignup = function(req, res) {
  res.render('signup', {
    title: '注册页面',
  });
}

exports.signup = function(req, res) {
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
          res.redirect('/signin');
        });
      } else {
        res.redirect('/signin');
        res.status = 500;
        res.end('Username already exist');
      }
    }
  });
}

// signin
exports.toSignin = function(req, res) {
  res.render('signin', {
    title: '登录页面',
  });
}

exports.signin = function(req, res) {
  const _user = req.body.user;
  const name = _user.name;
  const password = _user.password;

  User.findOne({ name }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (!user) {
        res.redirect('/signup');
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
            req.session.user = user;
            res.redirect('/');
          } else {
            res.redirect('/signin');
            res.status = 500;
            res.end('Password is not matched');
          }
        })
      }
    }
  })
}

// logout
exports.logout = function(req, res) {
  delete req.session.user;
  // delete app.locals.user;

  res.redirect('/');
}


// user middleware
exports.signinRequire = function(req, res, next) {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/signin');
  }
  next();
}

exports.adminRequire = function(req, res, next) {
  const user = req.session.user;

  if (user.role < 10) {
    return res.redirect('/');
  }
  next();
}
