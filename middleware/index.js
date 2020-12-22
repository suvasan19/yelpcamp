var Campground = require('../models/campground');
var Comment = require('../models/comment');
//all middleware goes here

var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundComment) {
			if (err) {
				req.flash('error', 'Error: Comment Not Found.');
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'You do not have access to this comment.');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You must be logged in first.');
		res.redirect('back');
	}
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				req.flash('error', 'Error: Campground Not Found.');
				res.redirect('back');
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'You do not have access to this campground.');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in.');
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You must be logged in first.');
	res.redirect('/login');
};

module.exports = middlewareObj;
