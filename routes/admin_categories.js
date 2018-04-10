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
* GET edit category
*/
router.get('/edit-category/:id', function(req, res){
    Category.findById(req.params.id, (err, category) => {
        if(err){
            console.log(err);
           
        } 
        if(!category){
            res.redirect('/admin/categories');
        }
        else{
            res.render('admin/edit_category', {
                title: category.title,
                id: category._id
            });
        }
    });
 
    
 });
/*
* POST edit category
*/
router.post('/edit-category/:id', function(req, res){
    req.checkBody('title', 'Title mush have a value').notEmpty();
  
 
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var id = req.params.id; 
    var content = req.body.content; 
 
    var errors = req.validationErrors();
    if(errors){
     //    console.log(errors);
     
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        }); 
    } else {
        Category.findOne({slug: slug, _id:{'$ne':id}}, (err, category) => {
            if(category){
                 req.flash('danger', 'category title exist choose another.');
                 res.render('admin/edit_category', {
                     title: title,
                     id: id
                 }); 
            } else {
            Category.findById(id, (err, category) => {
                if(err) return console.log(err);
                category.title = title;
                category.slug = slug;
                category.save((err) => {
                    if(err)   console.log(err);
                    req.flash('success', 'Category Edited');
                    res.redirect('/admin/categories/edit-category/' + id);
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

