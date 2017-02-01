var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
var locations = require('./routes/locations');
var forms = require('./routes/forms');


var app = express();

app.use(cors());

/////////////////// Connect to database  /////////////////////////////
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}
else {
  mongoose.connect('mongodb://localhost/exciser');
}
mongoose.connection.on('error', function(err) {
      console.error('MongoDB connection error: ' + err);
      process.exit(-1);
    }
);
mongoose.connection.once('open', function() {
  console.log("Mongoose has connected to MongoDB!");
});
///////////////////////////////////////////////////////////////////////

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, '../client/stylesheets'),
  dest: path.join(__dirname, '../client/stylesheets'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, '../client')));


///////////////// PASSPORT //////////////////////
app.use(session({ secret: "my secret...",
  resave: true,
  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

var passportConfigFunction = require('./passport/passport');
passportConfigFunction(passport);


// // This middleware will allow us to use the currentUser in our views and routes.
// app.use(function (req, res, next) {
//   global.currentUser = req.user;
//   next();
// });
////////////////////////////////////////////////

app.use('/', index);
app.use('/api/users/', users);
app.use('/api/locations', locations);
app.use('/api/forms',forms);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;