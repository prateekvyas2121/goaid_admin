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
//VIEW ENGINE SETUP
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//SETUP  PUBLIC FOLDER
app.use(express.static(path.join(__dirname,'public')));


// default route
app.get('/', (req, res) => {
	return res.send({ error: false, message: 'database connected successfully!' });

});

//setup admin routes
	//admin authentication routes
	const admin_authentication = require('./routes/admin_authentication.js');
	app.use('/admin/',admin_authentication);

app.listen(5000, () => {
	console.log(' GoAid admin is running on port 5000');
});

module.exports = app;