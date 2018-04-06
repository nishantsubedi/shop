var express = require('express');
var router = express.Router();

/*
* GET pages index
*/
router.get('/', function(req, res){
    res.render('index', {
        title: 'Admin Area' 
    });
});

/*
* GET add page
*/
router.get('/add-page', function(req, res){
   var  title = "";
   var slug = "";
   var content = "";

   res.render('admin/add_page', {
       title: title,
       slug: slug,
       content: content
   })
});



// Exports
module.exports = router;

