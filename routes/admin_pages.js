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

/*
* POST add page
*/
router.post('/add-page', function(req, res){
   req.checkBody('title', 'Title mush have a value').notEmpty();
   req.checkBody('content', 'Content mush have a value').notEmpty();

   var title = req.body.title;
   var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
   if(slug == ""){
    slug = title.replace(/\s+/g, '-').toLowerCase(); //If slug is empty then use title as slug
   }
   var content = req.body.content; 

   var errors = req.validationErrors();
   if(errors){
    //    console.log(errors);
    res.render('admin/add_page', {
        errors: errors,
        title: title,
        slug: slug,
        content: content
    }); 
   } else {
       console.log('success');
   }


   
 
    
 });

// Exports
module.exports = router;

