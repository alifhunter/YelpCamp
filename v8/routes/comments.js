const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// ==============
// Comments route
// ==============

// comments new
router.get('/new', isLoggedIn, (req, res) => {
	//find campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

// comments create
router.post('/', isLoggedIn, (req, res) => {
	//lookup campground using id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			//create new comments
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//connect new comments to campground
					campground.comments.push(comment);
					campground.save();
					//redirect back to show page
					res.redirect(`/campgrounds/${campground._id}`);
				}
			});
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

module.exports = router;
