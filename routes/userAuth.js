var mysql 		= require("mysql");
var express 	= require('express');
var app 		= express();
var path 		= require("path");
var bcrypt 		= require('bcryptjs');
var router  	= express.Router();

//you need this to be able to process information sent to a POST route
	var bodyParser = require('body-parser');

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));

	// parse application/json
	app.use(bodyParser.json());

//session stuff
	var cookieParser = require('cookie-parser');

	var session = require('express-session');

	//allow sessions
	router.use(session({ secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365 }}));

	router.use(cookieParser());

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
	host: "localhost",

	// Your port; if not 3306
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: "password",
	database: "pythonbooks_db"
});

router.use(express.static("../public"));

// this get request brings the use to the root route. 
// This request is meant to bring the user to the lgoin page. 
// We will change the route when we want to integrate to login page.
// We will also change the file path as well to the correct login prompt
router.get('/', function(req, res) {
	res.render("pages/home", {req: req.session.user_id});
});

// User clicked login button on nav-bar
router.get('/loginPage', function(req,res) {
	res.render("pages/login", {req: req.session.user_id});
});

// We use these params in order to remember the last page the user tried accessing
// req.session.user_id is used to check if there user is logged in
// req.params.nextRoute is used to grab the next route
// req.params.isbn is used to specify which book the user looked for.
router.get('/loginPage/:nextRoute/:isbn', function(req,res) {
	res.render("pages/login", {req: req.session.user_id, nextRoute: req.params.nextRoute, isbn: req.params.isbn});
});

// User just clicked register button on nav-bar
router.get('/registerPage', function(req,res) {
	res.render('pages/register', {req: req.session.user_id});
})

// This route happens when user enters register information from register.ejs file in views/pages
router.post('/register', function(req,res) {	
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(req.body.password, salt, function(err, p_hash) {
			
			connection.query('INSERT INTO users (name, email, username, password, rating_value, rating_number) VALUES (?, ?, ?, ?, 0.0, 0)', [req.body.name, req.body.email, req.body.username, p_hash], function (error, results, fields) {
				
				if(error) res.render('pages/register', {req: req.session.user_id, error: true});
				else res.render('pages/login', {req: req.session.user_id});
			});
		});
	});
});

// if a user is attempting to login regularly from the login button
router.post('/login', function(req,res) {
	loginAuth(res, req, '')	
})

// this post request will run if a user was not logged in and tried to get into the details search
router.post('/login/:route/:isbn', function(req,res) {

	// had to do a join because for some reason there's a spacing in the isbn variable
	var url = req.params.route+'?'+req.params.isbn;
	var finalUrl = url.split(' ').join('');
	loginAuth(res, req, finalUrl);
})

// When user clicks the logout button they will hit this route and end a session.
router.get('/logout', function(req,res) {
	req.session.logoutTime = getTime();
	req.session.destroy(function(err) {
		res.render('pages/logout.ejs', {req: null});
	})
});

// loginAuth takes in the response and request arguments fromt the annonymous 
// post request and the url argument is the url that they will redirect to.
// Runs query to look up user info and check if password is correct.
function loginAuth(res, req, url) {

	connection.query('SELECT * FROM users WHERE email = ?', [req.body.email], function(error, results, fields) {

		if (results.length == 0 || error) {
		  	res.render('pages/login', {req: req.session.user_id, error: true});
		} else {

			// compare encryptions because password is encrypted in the database.
		  	bcrypt.compare(req.body.password, results[0].password, function(err, result) {
		  	    if (result == true) {
		  	    	req.session.user_id = results[0].id;
		  	      	req.session.email = results[0].email;
		  	      	req.session.routerInfo = [];
		  	      	req.session.logInTime = getTime();
		  	      	res.redirect('/'+url);

		  	    } else {
		  	      	res.render('pages/login', {req: req.session.user_id, error: true});
		  	    }
		  	});
		}
	});
}


// function registerQuery(originalReq, originalRes) {
// 	connection.query('INSERT INTO users (name, email, username, password, rating_value, rating_number) VALUES (?, ?, ?, ?, 0.0, 0)', [req.body.name, req.body.email, req.body.username, p_hash], function (error, results, fields) {
// 	  	res.render('pages/login', {req: req.session.user_id});
// 	});
// }

module.exports = router;








