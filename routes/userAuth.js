var mysql 	= require("mysql");
var express = require('express');
var app 	= express();
var path 	= require("path");
var bcrypt 	= require('bcryptjs');
var router = express.Router();

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
router.get('/', function(req, res){
	res.render("pages/home");
});

router.get('/loginPage', function(req,res) {
	res.render("pages/login");
});

router.get('/registerPage', function(req,res) {
	res.render("pages/register");
})

// this doesn't work right now 
router.post('/register', function(req,res) {
	console.log('------');
	bcrypt.genSalt(10, function(err, salt) {
		// console.log(req.body);
		bcrypt.hash(req.body.password, salt, function(err, p_hash) {
			// connsole.log(p_hash)
			connection.query('INSERT INTO users (name, email, username, password, rating_value, rating_number) VALUES (?, ?, ?, ?, 0.0, 0)', [req.body.name, req.body.email, req.body.username, p_hash], function (error, results, fields) {
	    	  	res.redirect('/');
	    	});
		});
	});
});

router.get('/loginPage', function(req,res) {
	res.render('pages/login.ejs');
});

router.post('/login', function(req,res) {
	
	connection.query('SELECT * FROM users WHERE email = ?', [req.body.email], function(error, results, fields) {

		if (error) throw error;

		if (results.length == 0) {
		  	res.send('try again');
		}else {
		  	bcrypt.compare(req.body.password, results[0].password, function(err, result) {
		  	    // req.session
		  	    if (result == true) {
		  	    	req.session.user_id = results[0].id;
		  	      	req.session.email = results[0].email;
		  	      	
		  	      	res.redirect('/');

		  	    }else {
		  	      	res.redirect('/');
		  	    }
		  	});
		}
	});
})



module.exports = router;








