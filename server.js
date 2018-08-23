// requiring packages
var express = require('express');
var app 	= express();
var router 	= express.Router();
var path 	= require("path");


// Serve static content for the app from the "public" directory in the application directory.
// you need this line here so you don't have to create a route for every single file in the public folder (css, js, image, etc)
// index.html in the public folder will over ride the root route
app.use(express.static("public"));

// var questionRoutes = require('./routes/questions.js');

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('pages/index');
});

app.listen(3000, function(){
	console.log('listening on 3000');
});