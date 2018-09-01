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
	// res.sendFile(path.join(__dirname, "public/create.html"));
	res.render("pages/home");
});

router.post('/search', function(req, res){
	// console.log(req);
	// console.log("-----")
	// console.log(req.body.searchterms)
	// console.log(req._parsedOriginalUrl.search);
	// res.redirect('/searchResults'+req._parsedOriginalUrl.search);
	var query = connection.query(
		"SELECT * FROM searches WHERE ?",
		{ isbn: req.body.searchterms },
		function(err, response) {
			if(err) console.log(err);
			if(response.length ==0){
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
		res.redirect('/searchResults?searchterms='+req.body.searchterms)}
	);
});

router.get('/searchResults', function (req, res){
	// console.log("within search results, req:")
	// console.log(req.url);
	//req.url: /searchResults?searchterms=1305270339
	var queryStr = req.url.split("?")[1];
	var queryArray = queryStr.split("&");
	var searchTerm = queryArray[0].split("=")[1];
	//searchTerm should be the isbn now
	var query = connection.query(
		"SELECT * FROM postings WHERE ?",
		{ isbn: searchTerm },
		function(err, response) {
			if(err) console.log(err);
			if(response.length ==0){
				//searched isbn has not been searched before
				
			}else{
				
			}
		// console.log("response from searches table:");
		// console.log(response);
		res.render("pages/searchResults", {searchResults: response});
		}
	);
})

module.exports = router;