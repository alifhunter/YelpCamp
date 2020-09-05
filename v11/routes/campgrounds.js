const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

// INDEX - show all campgrounds
router.get('/', (req, res) => {
	// get campgrounds from db
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log('error');
		} else {
			res.render('campgrounds/index', { campgrounds: allCampgrounds });
		}
	});
});

// NEW - show form to create new campgrounds
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

// CREATE - add new campground to database
router.post('/', middleware.isLoggedIn, (req, res) => {
	// get data from form
	var name = req.body.name; // name="name"
	var price = req.body.price;
	var image = req.body.image; // name="image"
	var description = req.body.description; // name="description"
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCamp = { name: name, price: price, image: image, description: description, author: author };
	//create new campground and save to database
	Campground.create(newCamp, (err, newCampground) => {
		if (err) {
			console.log(err);
		} else {
			//redirect back to campground page
			res.redirect('/campgrounds');
		}
	});
});

// SHOW - show more info about one campground
router.get('/:id', (req, res) => {
	//find campground with provided id
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampgrounds) => {
		if (err || !foundCampgrounds) {
			req.flash('error', 'Campground not found');
			res.redirect('/campgrounds');
		} else {
			//render template
			res.render('campgrounds/show', { campground: foundCampgrounds });
		}
	});
});

// EDIT - edit form campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampgrounds) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.render('campgrounds/edit', { campground: foundCampgrounds });
		}
	});
});

// UPDATE - update campground route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	// find and update
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			// redirect
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// DESTROY - destroy campground route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	});
});

// middleware - is logged in?
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampgrounds) => {
			if (err) {
				res.redirect('back');
			} else {
				// does user own campground
				if (foundCampgrounds.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		res.redirect('back');
	}
}

module.exports = router;
