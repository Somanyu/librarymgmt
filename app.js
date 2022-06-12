const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const flash = require('connect-flash');
const rateLimit = require('express-rate-limit');

dotenv.config({ path: './.env' });

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
const libraryRouter = require('./routes/library');

const app = express();

// Set up rate limiter: maximum of five requests per minute
var limiter = rateLimit({
  windowMs: 5*60*1000, // 5 minutes
  max: 5, // Limit each IP to 5 requests per `window` every 5 minutes.
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers.
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers 
});

// Apply rate limiter to all requests
app.use(limiter);


// Create Session for middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_CONNECT,
  { useNewUrlParser: true }, (err) => {
    if (!err) {
      console.log('Connected to MongoDB Atlas (myFirstDatbase).');
    } else {
      console.log('Error in connecting to MongoDB Atlas: ' + err);
    }
  }
)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/library', libraryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
