var mysql 	= require("mysql");
var express = require('express');
var app 	= express();
var path 	= require("path");
var bcrypt 	= require('bcryptjs');

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
	app.use(session({ secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365 }}));

	app.use(cookieParser());

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
	host: "localhost",

	// Your port; if not 3306
	port: 3000,

	// Your username
	user: "root",

	// Your password
	password: "password",
	database: "project2Practice"
});

app.use(express.static("public"));


// this get request brings the use to the root route. 
// This request is meant to bring the user to the lgoin page. 
// We will change the route when we want to integrate to login page.
// We will also change the file path as well to the correct login prompt
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, "public/testLogin.html"));
});

app.get('/loginPage', function(req,res) {
	res.sendFile(path.join(__dirname, "public/login.html"));
});

app.get('/registerPage', function(req,res) {
	res.sendFile(path.join(__dirname, "public/register.html"));
});

app.post('/register', function(req,res) {
	
	console.log(req.body);
	res.redirect('/');
});









app.listen(3000, function(){
	console.log('listening on 3000');
});
