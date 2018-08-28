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
  password: "ym",
  database: "pythonbooks_db"
});

// since this is a practice file, i used create.html as the default route.
// path.join just joins the absolute path to this directory with the relative path that you input as the 2nd argument of .join()
router.get('/', function(req, res) {
	// res.sendFile(path.join(__dirname, "public/create.html"));
	res.render("pages/home");
});

router.post('/search', function(req, res){
	console.log(req);
	console.log("-----")
	console.log(req.body.searchterms)
	// console.log(req._parsedOriginalUrl.search);
	// res.redirect('/searchResults'+req._parsedOriginalUrl.search);
	var query = connection.query(
		"INSERT INTO searches SET ?",
		{ isbn: req.body.searchterms, number_of_search: 0 },
		function(err, response) {
			if(err) console.log(err);
			res.redirect('/searchResults?searchterms='+req.body.searchterms);
	}
  );
	
})

router.get('/searchResults', function (req, res){
	res.render("pages/searchResults");
})

module.exports = router;