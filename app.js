var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');

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

// Set routes
var pages = require('./routes/pages');
var adminPages = require('./routes/admin_pages');

app.use('/', pages);
app.use('/admin/pages', adminPages);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log('Server startted on port ' + port);
});

