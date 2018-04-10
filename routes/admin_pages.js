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
        content: content
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
                sorting: 100
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



 /*
* GET edit page
*/
router.get('/edit-page/:id', function(req, res){
    Page.findById(req.params.id, (err, page) => {
        if(err) {
            // return console.log(err);
            console.log(err);
        }
        
        if(!page){
            res.redirect('/admin/pages');
        }   
        
        else{
            res.render('admin/edit_page', {
                title: page.title,
                slug: page.slug,
                content: page. content,
                id: page._id
            });
        }
    });
 
    
 });
/*
* POST edit page
*/
router.post('/edit-page/:id', function(req, res){
    req.checkBody('title', 'Title mush have a value').notEmpty();
    req.checkBody('content', 'Content mush have a value').notEmpty();
 
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if(slug == ""){
     slug = title.replace(/\s+/g, '-').toLowerCase(); //If slug is empty then use title as slug
    }
    var id = req.params.id; 
    var content = req.body.content; 
 
    var errors = req.validationErrors();
    if(errors){
     //    console.log(errors);
     
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        }); 
    } else {
        Page.findOne({slug: slug, _id:{'$ne':id}}, (err, page) => {
            if(page){
                 req.flash('danger', 'page ' + slug +' exist choose another.');
                 res.render('admin/edit_page', {
                     title: title,
                     slug: slug,
                     content: content,
                     id: id
                 }); 
            } else {
            Page.findById(id, (err, page) => {
                if(err) return console.log(err);
                page.title = title;
                page.slug = slug;
                page.content = content;
                page.save((err) => {
                    if(err)   console.log(err);
                    req.flash('success', 'Page Edited');
                    res.redirect('/admin/pages/edit-page/' + page.id);
                });
            });
            
            }
        });
    }
 
 });

/*
* GET delete page
*/
router.get('/delete-page/:id', function(req, res){
    Page.findByIdAndRemove(req.params.id, (err) => {
        if(err) return console.log(err);
        req.flash('success', 'Page Deleted');
        res.redirect('/admin/pages/');
    })
    
});

// Exports
module.exports = router;

