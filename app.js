var express = require('express');
var path = require('path');

// Init app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public folder

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.send('working');
})

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log('Server startted on port ' + port);
});

