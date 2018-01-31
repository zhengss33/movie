const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');
const router = require('./router');
const dbUrl = 'mongodb://127.0.0.1/movie';
const app = express();

mongoose.connect(dbUrl);

app.set('views', './app/views/pages');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'movie',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: dbUrl,
    collection: 'sessions'
  }),
}));
app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname, 'public')));
if (app.get('env') === 'development') {
  app.use(logger('dev'));
  app.set('showStackError', true);
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

router(app);

app.listen(port);

console.log('Server running at port 3000');
