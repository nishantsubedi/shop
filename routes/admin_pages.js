var express = require('express');
var router = express.Router();

// Get Page Moddel
var Page = require('../models/page');

/*
* GET pages index
*/
router.get('/', function(req, res){
    Page.find({}).sort({sorting: 1}).exec((err, pages) => {
        res.render('admin/pages', {
            title: 'Pages',
            pages: pages  
        }); 
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
        content: content,
        sorting: 100
    }); 
   } else {
       Page.findOne({slug: slug}, (err, page) => {
           if(page){
                req.flash('danger', 'page ' + slug +' exist choose another.');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                }); 
           } else {
            var page = new Page({
                title: title,
                slug: slug,
                content: content,
                sortin: 0
            });
            page.save((err) => {
                if(err)   console.log(err);
                req.flash('success', 'Page Addded');
                res.redirect('/admin/pages');
            });
           }
       });
   }

});
/*
* POST reorder pages
*/
router.post('/reorder-pages', function(req, res){
   var ids = req.body['id[]'];
   var count = 0;
   for( var i = 0; i < ids.length; i++) {
       var id = ids[i];
       count++;
     (function(count){
       Page.findById(id, (err, page) => {
           page.sorting = count;
           page.save((err) => {
                if(err){
                    return console.log(err);
                }
           });
       });
    })(count);
   }

 
    
 });

// Exports
module.exports = router;

