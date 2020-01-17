var express = require('express');
var app = express();
const path = require('path');
const ejs = require('ejs');
var bodyParser = require('body-parser');
const config = require('./config/database.js');
var session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
var sess; // global session, NOT recommended
//SETUP  PUBLIC FOLDER
app.use(express.static(path.join(__dirname,'public')));

//VIEW ENGINE SETUP
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


//setup admin routes
	//admin authentication routes
	const admin_routes = require('./routes/admin_routes.js');
	app.use('/admin/',admin_routes);
	// //admin CRUD routes
	// const admin_crud = require('./routes/admin_crud.js');
	// app.use('add_admin',admin_crud);

app.listen(5000, (error) => {
	if (error) {
		console.log("ERROR =============>>>>>>",error);
	}
	console.log(' GoAid admin is running on port 5000');
});

// module.exports = app;