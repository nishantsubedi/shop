var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');

// Connect to db
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => {
    console.log('Connected to mongodb');
})
// Init app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Det Global error variable
app.locals.errors = null;
//Body Parser middleware
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));

  //Express Validator middleware
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;    
        
        while(namespace.length) {
            formParam += '[' + namespace.shift()() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Set routes
var pages = require('./routes/pages');
var adminPages = require('./routes/admin_pages');
var adminCategories = require('./routes/admin_categories');

app.use('/', pages);
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log('Server startted on port ' + port);
});

