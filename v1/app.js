// INCLUDE PACKAGES
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// SETTINGS
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// ARRAY
var campgrounds = [
    {name: "Salmon Creek", image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
    {name: "Bogor Hill", image: "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
    {name: "Yashinoya Rest", image: "https://pixabay.com/get/55e8dc404f5aab14f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
    {name: "Salmon Creek", image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
    {name: "Bogor Hill", image: "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
    {name: "Yashinoya Rest", image: "https://pixabay.com/get/55e8dc404f5aab14f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
    {name: "Salmon Creek", image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
    {name: "Bogor Hill", image: "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
    {name: "Yashinoya Rest", image: "https://pixabay.com/get/55e8dc404f5aab14f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"}
];

// ROUTES
app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.get("/campgrounds/new", function(req,res){
    res.render("new");
});

app.post("/campgrounds", function(req,res){
    // get data from form
    var name = req.body.name; // name="name"
    var image = req.body.image; // name="image"
    var newCamp = {name: name, image: image};
    //add to campgrounds array
    campgrounds.push(newCamp);
    //redirect back to campground page
    res.redirect("/campgrounds");
});

app.listen("3000", function(){
    console.log("Serving on port 3000");
}); 