const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// INDEX - show all campgrounds
router.get("/", (req,res) => { 
    // get campgrounds from db
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log("error");
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

// NEW - show form to create new campgrounds
router.get("/new", (req,res) =>{
    res.render("campgrounds/new");
});

// CREATE - add new campground to database
router.post("/", (req,res) =>{
    // get data from form
    var name = req.body.name; // name="name"
    var image = req.body.image; // name="image"
    var description = req.body.description; // name="description"
    var newCamp = {name: name, image: image, description: description};
    //create new campground and save to database
    Campground.create(newCamp, (err,newCampground) =>{
        if(err){
            console.log(err);
        } else {
            //redirect back to campground page
            res.redirect("/campgrounds");
        }
    })
});

// SHOW - show more info about one campground
router.get("/:id", (req,res) =>{
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampgrounds) =>{
        if(err){
            console.log(err);
        } else {
            //render template
            res.render("campgrounds/show", {campground: foundCampgrounds});
        }
    });
});

module.exports = router;