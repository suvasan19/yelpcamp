var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

//INDEX - Show all campgrounds
router.get('/', function(req, res) {
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCamps) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: allCamps, currentUser: req.user });
		}
	});
});

//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});

//CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
	//get data from form and add to camp array
	//redirect back to campgrounds
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newcamp = { name: name, price: price, image: image, description: desc, author: author };
	Campground.create(newcamp, function(err, camp) {
		if (err) {
			console.log(err);
			req.flash('error', 'Error: Campground Not Found.');
			res.redirect('campgrounds/show');
		} else {
			req.flash('success', 'Campground Created Successfully');
			res.redirect('/campgrounds');
		}
	});
});

//SHOW
router.get('/:id', function(req, res) {
	//find campground with given id
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCamp) {
		if (err) {
			console.log(err);
			req.flash('error', 'Error: Campground Not Found.');
			res.redirect('campgrounds/show');
		} else {
			res.render('campgrounds/show', { campground: foundCamp });
		}
	});
	//render show template for given campground
});

//Edit Route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render('campgrounds/edit', { campground: foundCampground });
	});
});

//Update Route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	//find and update to show correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			req.flash('error', 'Error: Campground Not Found.');
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Updated Successfully');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
	//redirect
});

//Destroy Route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	//if(res.isAuthenticated()){}

	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			req.flash('error', 'Error: Campground Not Found.');
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Deleted Successfully');
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;
