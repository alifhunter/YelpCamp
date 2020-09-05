// INCLUDE PACKAGES
const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      seedDB = require("./seeds");

// CONNECT TO MONGOOSE
// for deprecation
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
// connection
mongoose.connect("mongodb://localhost/yelpcamp");

// SETTINGS
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedDB();

// ROUTES
app.get("/", function(req,res){
    res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req,res){
    // get campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("error");
        } else {
            res.render("index", {campgrounds:allCampgrounds});
        }
    });
});

// NEW - show form to create new campgrounds
app.get("/campgrounds/new", function(req,res){
    res.render("new");
});

// CREATE - add new campground to database
app.post("/campgrounds", function(req,res){
    // get data from form
    var name = req.body.name; // name="name"
    var image = req.body.image; // name="image"
    var description = req.body.description; // name="description"
    var newCamp = {name: name, image: image, description: description};
    //create new campground and save to database
    Campground.create(newCamp, function(err,newCampground){
        if(err){
            console.log(err);
        } else {
            //redirect back to campground page
            res.redirect("/campgrounds");
        }
    })
});

// SHOW - show more info about one campground
app.get("/campgrounds/:id", function(req,res){
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampgrounds){
        if(err){
            console.log(err);
        } else {
            //render template
            res.render("show", {campground: foundCampgrounds});
        }
    });
});

app.listen("3000", function(){
    console.log("YelpCamp server is running on port 3000");
}); 