var mysql 	= require("mysql");
var express = require('express');
var app 	= express();
var path 	= require("path");
var bcrypt 	= require('bcryptjs');

app.use(express.static("public"));

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
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: "password",
	database: "project2Practice"
});


connection.query('SELECT * FROM users', function(err,res) {
	if(err) console.log(err);
	else {
		console.log(res);
	}
})


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

// this doesn't work right now 
app.post('/register', function(req,res) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(req.body.password_hash, salt, function(err, p_hash) {
			console.log(p_hash);
			console.log(req.body.email);
			console.log(req.body.user_name);

			var query = 'INSERT INTO users (email, user_name, password_hash) VALUES ("'+req.body.email+'", "'+req.body.user_name+'", "'+p_hash+'");'

			connection.query(query, function (error, results, fields) {
	    	  	console.log('--------');
		    	var what_user_sees = "";
		    	if (error){
		    		console.log(err);
		    		console.log('--------');
		    	  	what_user_sees = 'you need to use a unique email';
		    	}else{
		    	  	what_user_sees = 'you have signed up - please go login at the login route';
		    	}
		    	// res.send(what_user_sees);
	    	  	res.redirect('/');
	    	});
		});
	});
});


app.get('/loginPage', function(req,res) {
	res.sendFile(path.join(__dirname, "public/login.html"));
});

app.post('/login', function(req,res) {
	// console.log(req.body.email);
	// console.log(req.body.password_hash);
	// var query = connection.query('SELECT * FROM users',  function(error, response, fields) {
	// 	console.log(response);
	// 	connection.end();
	// 	res.redirect('/');
	// })

	connection.query('SELECT * FROM users WHERE email = ?', [req.params.email],function (error, results, fields) {

	  if (error) throw error;

	  // res.json(results);
	  if (results.length == 0){
	  	res.send('try again');
	  }else {
	  	bcrypt.compare(req.params.password, results[0].password_hash, function(err, result) {
	  	    
	  	    if (result == true){

	  	      req.session.user_id = results[0].id;
	  	      req.session.email = results[0].email;

	  	      res.send('you are logged in');

	  	    }else{
	  	      res.redirect('/');
	  	    }
	  	});
	  }
	});
})





app.listen(3000, function(){
	console.log('listening on 3000');
});
