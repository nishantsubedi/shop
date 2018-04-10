var express = require('express');
var router = express.Router();

// Get Category Moddel
var Category = require('../models/category');

/*
* GET category index
*/
router.get('/', function(req, res){
    Category.find((err, categories) => {
        if(err) console.log(err);

        res.render('admin/categories', {
            title: 'Categories',
            categories: categories  
        }); 
    });
    
});

/*
* GET add category      
*/
router.get('/add-category', function(req, res){
   var  title = "";
  

   res.render('admin/add_category', {
       title: title
   })
});

/*
* POST add category
*/
router.post('/add-category', function(req, res){
   req.checkBody('title', 'Title mush have a value').notEmpty();
  

   var title = req.body.title;
   var slug = title.replace(/\s+/g, '-').toLowerCase();
  

   var errors = req.validationErrors();
   if(errors){
    //    console.log(errors);
    
    res.render('admin/add_category', {
        errors: errors,
        title: title
    }); 
   } else {
       Category.findOne({slug: slug}, (err, category) => {
           if(category){
                req.flash('danger', 'page ' + title +' exist choose another.');
                res.render('admin/add_category', {
                    title: title,
                    slug: slug
                }); 
           } else {
            var category = new Category({
                title: title,
                slug: slug
            });
            category.save((err) => {
                if(err)   console.log(err);
                req.flash('success', 'Category Addded');
                res.redirect('/admin/categories');
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
router.get('/edit-page/:slug', function(req, res){
    Page.findOne({slug: req.params.slug}, (err, page) => {
        if(err){
            return console.log(err);
            
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
router.post('/edit-page/:slug', function(req, res){
    req.checkBody('title', 'Title mush have a value').notEmpty();
    req.checkBody('content', 'Content mush have a value').notEmpty();
 
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if(slug == ""){
     slug = title.replace(/\s+/g, '-').toLowerCase(); //If slug is empty then use title as slug
    }
    var id = req.body.id; 
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
                    res.redirect('/admin/pages/edit-page/' + page.slug);
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
