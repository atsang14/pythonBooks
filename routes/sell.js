
var express = require('express');
var app 	= express();
var path 	= require("path");
var mysql   = require('mysql');
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

// When the user submits the form for selling something, we hit the /create route
// This route inserts the what the user put into the postings table
router.post('/create', function(req, res){

	if(req.session.id == null) {
		alert('Login First');
	}else {
		// console.log(req.session.id)
		req.body.user_id 	= parseInt(req.session.user_id);
		req.body.book_title = 'Book Title Here';

		databaseCheck(req, res);

		// var postings = "user_id, book_title, price, book_condition, isbn, time_stamp";
		// var values = req.body.user_id+", '"+req.body.book_title+"', '"+req.body.price+"', '"+req.body.book_condition+"', '"+req.body.isbn+"', NOW()";
	
		// var query = connection.query(
		//   	"INSERT INTO postings("+postings+") VALUES ("+values+")",
		//   	function(err, response) {
		// 	  	if(err) console.log(err);
		// 	    res.redirect('/');
		//   	}
		// );
	}
});

function databaseCheck(request, originalRes) {
	connection.query("SELECT book_title FROM postings WHERE isbn = '"+request.body.isbn+"'", function(err, res) {
		if(err) console.log(err);
		else {
			if(res[0].book_title == 0) {
				// do search here
			} else {
				insertIntoDb(request, originalRes, res)
			}
		}
	})
}

function insertIntoDb(request, originalRes, res) {
	var postings = "user_id, book_title, price, book_condition, isbn, time_stamp";
	var values = request.body.user_id+", '"+res[0].book_title+"', '"+request.body.price+"', '"+request.body.book_condition+"', '"+request.body.isbn+"', NOW()";

	var query = connection.query(
	  	"INSERT INTO postings("+postings+") VALUES ("+values+")",
	  	function(err, response) {
		  	if(err) console.log(err);
		    originalRes.redirect('/');
	  	}
	);
}




module.exports = router;

























