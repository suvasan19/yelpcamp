var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	flash = require('connect-flash'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds');

//requiring routes
var commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
// mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://admin:yelp@yelpcamp.1z75n.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
	useNewUrlParser: true
});
//mongodb+srv://admin:yelp@yelpcamp.1z75n.mongodb.net/yelpcamp?retryWrites=true&w=majority

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB(); //Seed the database

//Passport Configuration
app.use(
	require('express-session')({
		secret: 'Cristiano Ronaldo is the Goat',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

// Set Schema for Campgrounds
app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Yelpcamp Server Has Started!');
});
