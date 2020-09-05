// INCLUDE PACKAGES
const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose'),
	session = require('express-session'),
	methodOverride = require('method-override'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds');

// Require Routes
const campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index');

// CONNECT TO MONGOOSE
// for deprecation
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
// connection
mongoose.connect('mongodb://localhost/yelpcamp');

// SETTINGS
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); // serve public directory
app.use(methodOverride('_method'));

//seedDB();

// PASSPORT CONFIGURATION
app.use(
	session({
		secret: 'IU still the best',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware biar bisa ngambil data user dari db
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

// panggil routes
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen('3000', function() {
	console.log('YelpCamp server is running on port 3000');
});
