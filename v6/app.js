// INCLUDE PACKAGES
const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      passportLocalMongoose = require('passport-local-mongoose'),
      session = require('express-session'),
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      User = require("./models/user"),
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

// PASSPORT CONFIGURATION
app.use(session({
    secret: "IU still the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware biar bisa ngambil data user dari db
app.use((req,res,next) => {
    res.locals.user = req.user;
    next();
});

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

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req,res) =>{
    //find campground by id
    Campground.findById(req.params.id, (err,campground) =>{
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req,res) =>{
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

// ==========
// AUTH ROUTE
// ==========

// show registration form
app.get('/register', (req,res) => {
    res.render('register');
});

// handle registration logic
app.post('/register', (req,res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('/register');
        }
        passport.authenticate("local")(req, res, () => { // local strategy
            res.redirect("/campgrounds");
        });
    });
});

// show login form
app.get('/login', (req, res) => {
    res.render('login');
});

// handle login logic
app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {

});

// handle logout
app.get('/logout', (req,res) =>{
    req.logOut();
    res.redirect('/campgrounds');
});

// is logged in?
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen("3000", function(){
    console.log("YelpCamp server is running on port 3000");
}); 