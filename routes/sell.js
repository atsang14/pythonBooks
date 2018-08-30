
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

router.post('/create', function(req, res){
	console.log(req.body);

	// -- WE NEED TO USE SESSION HERE -- 
	// here i manually put in a user name because we have not yet created
	// any users. We may use this method again when we grab a user information from a 'users' table.
	// req.body.user_name = 'Austin';
	// if(req.session.id == null){
	// 	alert('Login First');
	// }else {

		req.body.user_id = parseInt(req.session.id);
		req.body.book_title = 'Book Title Here';

		// --- THIS LINE WILL RUN INTO AN ERROR BECAUSE THE TABLE NAME MUST BE CHANGED ---
		// run query to insert into table getInput
		var query = connection.query(
		  	"INSERT INTO postings(user_id, price, book_title, book_condition, isbn) VALUES ("+req.body.user_id+", "+req.body.price+", "+req.body.book_title+", "+req.body.book_condition+", "+req.body.isbn+")",
		  	function(err, response) {
			  	if(err) console.log(err);
			    res.redirect('/');
		  	}
		);
	// }

});

// INSERT INTO postings (user_id, price, book_title, book_condition, isbn) VALUES (1, 2, '3', '4', '13245');








module.exports = router;