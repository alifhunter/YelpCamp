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
app.use(express.static(__dirname + "/public")); // serve public directory

seedDB();

// ROUTES // 
app.get("/", (req,res) =>{
    res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", (req,res) => { 
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
app.get("/campgrounds/new", (req,res) =>{
    res.render("campgrounds/new");
});

// CREATE - add new campground to database
app.post("/campgrounds", (req,res) =>{
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
app.get("/campgrounds/:id", (req,res) =>{
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

// ==============
// Comments route
// ==============

app.get("/campgrounds/:id/comments/new", (req,res) =>{
    //find campground by id
    Campground.findById(req.params.id, (err,campground) =>{
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", (req,res) =>{
    //lookup campground using id
    Campground.findById(req.params.id, (err,campground) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comments
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                } else {
                    //connect new comments to campground
                    campground.comments.push(comment);
                    campground.save();    
                    //redirect back to show page
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
})

app.listen("3000", function(){
    console.log("YelpCamp server is running on port 3000");
}); 