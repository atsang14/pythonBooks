// requiring packages
var express = require('express');
var app 	= express();
var path 	= require("path");
var mysql   = require('mysql');

//you need this to be able to process information sent to a POST route
	var bodyParser = require('body-parser');

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));

	// parse application/json
	app.use(bodyParser.json());

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
  database: "project2Practice"
});

// since this is a practice file, i used create.html as the default route.
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, "public/create.html"));
});


// when user submits the information in the create.html file, insert into the project2Practice database.
app.post('/create', function(req, res){
	console.log(req.body);
	req.body.user_name = 'Austin';
	
	// run query to insert into table getInput
	var query = connection.query(
	  "INSERT INTO getInput SET ?",
	  req.body,
	  function(err, response) {
	  	if(err) console.log(err);
	    res.redirect('/');
	  }
	);
});













app.listen(3000, function(){
	console.log('listening on 3000');
});