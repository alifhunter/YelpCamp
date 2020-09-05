// all the middleware goes here
var middlewareObj = {};
const Campground = require('../models/campground');
const Comment = require('../models/comment');

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampgrounds) => {
			if (err || !foundCampgrounds) {
				req.flash('error', 'Campgrounds not found');
				res.redirect('back');
			} else {
				// does user own campground
				if (foundCampgrounds.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', "You don't have permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in');
		res.redirect('back');
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComments) => {
			if (err || !foundComments) {
				req.flash('error', 'ERROR');
				res.redirect('back');
			} else {
				// does user own comment
				if (foundComments.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', "You don't have permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in');
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You need to be logged in to do that!');
	res.redirect('/login');
};

module.exports = middlewareObj;
