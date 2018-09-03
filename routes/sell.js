
var express = require('express');
var app 	= express();
var path 	= require("path");
var mysql   = require('mysql');
var request = require('request');
var router = express.Router();

app.set ('view engine', 'ejs');

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

// if user is logged in, it will redirect them the the actuall sell page
// if the user is not logged in, then it will send them to
// the login page.
router.get('/sell', function(req, res){
	if(!req.session.user_id) res.render('pages/loginBeforeSell');
	else res.render('pages/sell');
});

// When the user submits the form for selling something, we hit the /create route
// This route inserts the what the user put into the postings table
router.post('/create', function(req, res){

	// If the user is not logged in
	if(req.session.user_id == null) {

		// login prompt can go here
		console.log('Login First');
	}else {
		isbnQuery(req, res);
	}
});

// This function runs a query to see if the isbn is in the postings table
// then calls another function to run a check
function isbnQuery(request, originalRes) {

	// query to check if isbn is already in the database. We use this to grab the book title
	// if the isbn is already in the database
	var query = "SELECT book_title FROM postings WHERE isbn = '"+request.body.isbn+"'"
	
	connection.query(query, function(err, res) {
		if(err) console.log(err);
		else {
			checkTable(request, originalRes, res);
		}
	})
}

// The arguments for this function hold the original request and response from the post request.
// as well as the response from the isbn query.
// We use these arguments to test if the book title is already in the db.
// If it's not already in the db then we make a request to get the book title.
function checkTable(originalRequest, originalRes, res) {
	
	var bookTitle = '';
	var postings = "user_id, book_title, price, book_condition, isbn, time_stamp";
	var values = '';
	originalRequest.body.user_id = parseInt(originalRequest.session.user_id);

	if(res.length == 0) {
		
		var url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'+originalRequest.body.isbn;
		request(url, function(err, response, body) {
			if (!err && response.statusCode === 200) {
				
				bookTitle = JSON.parse(body).items[0].volumeInfo.title;
				values = originalRequest.body.user_id+", '"+bookTitle+"', '"+originalRequest.body.price+"', '"+originalRequest.body.book_condition+"', '"+originalRequest.body.isbn+"', NOW()";
				runFinalQuery(originalRes, postings, values);
	  		} else console.log(err);
		});
	} else {
	
		values = originalRequest.body.user_id+", '"+res[0].book_title+"', '"+originalRequest.body.price+"', '"+originalRequest.body.book_condition+"', '"+originalRequest.body.isbn+"', NOW()";
		runFinalQuery(originalRes, postings, values);
	}
}

// this final query function runs a query based conditions in checkTable();
function runFinalQuery(originalRes, postings, values) {
	connection.query(
		  	"INSERT INTO postings("+postings+") VALUES ("+values+")",
	  	function(err, response) {
		  	if(err) console.log(err);
		    originalRes.redirect('/');
	  	}
	);	
}

module.exports = router;

























