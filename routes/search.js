// requiring packages
var express = require('express');
var app 	= express();
var path 	= require("path");
var mysql   = require('mysql');
var router = express.Router();

// //you need this to be able to process information sent to a POST route
// 	var bodyParser = require('body-parser');

// 	// parse application/x-www-form-urlencoded
// 	app.use(bodyParser.urlencoded({ extended: true }));

// 	// parse application/json
// 	app.use(bodyParser.json());
app.set ('view engine', 'ejs')

var path = require("path");

// Serve static content for the app from the "public" directory in the application directory.
// you need this line here so you don't have to create a route for every single file in the public folder (css, js, image, etc)
// index.html in the public folder will over ride the root route
app.use(express.static("public"));

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

// since this is a practice file, i used create.html as the default route.
// path.join just joins the absolute path to this directory with the relative path that you input as the 2nd argument of .join()
router.get('/', function(req, res) {
	
	res.render("pages/home", {req: req.session.user_id});
	console.log(req.session.routerInfo);
});

router.post('/search', function(req, res){
	// console.log(req);
	// console.log("-----");
	// console.log(req.body.searchterms);
	if (req.body.searchBy=="title"){
		//route to intermediate page to narrow search results
		addRouteInfo(req, '/titleResults?searchterms='+req.body.searchterms);
		console.log(req.session.routerInfo);
		res.redirect('/titleResults?searchterms='+req.body.searchterms);
	} else {
		// search term is the isbn
		var query = connection.query(
			"SELECT * FROM searches WHERE ?",
			{ isbn: req.body.searchterms },
			function(err, response) {
				if(err) console.log(err);
				if(response.length == 0) {
					//searched isbn has not been searched before
					var query = connection.query(
						"INSERT INTO searches SET ?",
						{ isbn: req.body.searchterms, number_of_search: 1 },
						function(err2, response2){
							if(err2) console.log(err2);
						}
					);
				}else{
					//searched isbn has been searched before
					var query = connection.query(
						"UPDATE searches SET ? WHERE ?",
						[{ number_of_search: response[0].number_of_search + 1 },
						{ isbn: req.body.searchterms}]	,
						function(err2, response2){
							if(err2) console.log(err2);
						}
					);
				}
				// console.log('you are on line 78');
				// route: nextRoute
				addRouteInfo(req, '/searchResults?searchterms='+req.body.searchterms); 
				console.log(req.session.routerInfo);
				res.redirect('/searchResults?searchterms='+req.body.searchterms);
			}
		);
	}
});

router.get('/titleResults', function (req, res){
	// console.log("within title results, req:")
	// console.log(req);
	// req.url: /titleResults?searchterms=flat%20pack
	var queryStr = req.url.split("?")[1];
	var queryArray = queryStr.split("&");
	var searchTerm = queryArray[0].split("=")[1];
	// res.render("pages/searchIntermediate", {searchTerm: searchTerm});
	if (req.session.hasOwnProperty("user_id")){

		res.render("pages/searchIntermediate", {searchTerm: searchTerm, req: req.session.user_id});
	} else {
		res.render("pages/searchIntermediate", {searchTerm: searchTerm, req: null});
		// res.render("pages/searchIntermediate", {searchTerm: searchTerm, req: null, nextRoute: route, searchTerm: isbn});
	}
})

router.get('/searchResults', function (req, res){
	// console.log("within search results, req:")
	// console.log(req);
	//req.url: /searchResults?searchterms=1305270339
	// console.log(req.url);
	var queryStr = req.url.split("?")[1];
	var queryArray = queryStr.split("&");
	var searchTerm = queryArray[0].split("=")[1];

	// variable route and isbn are used to redirect back to the page if login was successful
	var route = '/searchResults';
	var isbn = queryStr;

	var query = connection.query(
		"SELECT * FROM postings WHERE ?",
		{ isbn: searchTerm },
		function(err, response) {
			if(err) console.log(err);
			
			// console.log("response from searches table:");
			// console.log(response);
			
			// if user is logged in, else
			if (req.session.hasOwnProperty("user_id")){		
				res.render("pages/searchResults", {searchResults: response, req: req.session.user_id});
			} else {
				res.render("pages/searchResults", {searchResults: response, req: null, nextRoute: route, searchTerm: isbn});
			}
		}
	);
})

router.get('/postingDetails/:id', function(req, res){
	// console.log("within posting details, req:")
	// console.log(req);
	addRouteInfo(req);
	console.log(req.session.routerInfo);
	var postId = req.params.id;
	var query = connection.query(
		//when joining the postings and the users table, and both tables have id column, have to alias one column and not select the other column in order to produce a response that's not confusing
		"SELECT	postings.id AS post_id, user_id, book_title, price, book_condition, isbn, time_stamp, name, email, username, rating_value, rating_number FROM postings LEFT JOIN users ON postings.user_id = users.id WHERE postings.id="+postId,
		function(err, response) {
			if(err) console.log(err);
			// console.log("response from searches table:");
			// console.log(response);
			res.render("pages/postingDetails", {postingDetails: response, req: req.session.user_id});
		}
	)
})

module.exports = router;


