const express = require('express');
const router = express.Router();
var session = require('express-session');
// const config = require('../config/database.js');

var mysql = require('mysql');
// connection configurations
 var dbConn = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'goaid_admin'
 });

dbConn.connect();


router.get('/login',(req,res) => {
	// res.send("currently on login page");
	res.render('admin/login.ejs');
});


router.get('/admin_dashboard',(req,res) => {
	res.render('admin/admin_dashboard');
});


router.post('/login/admin_dashboard',(req,res) => {
	// req.body.email,req.body.password
	var email = req.body.email;
	var password = req.body.password;
if (email && password) {
	dbConn.query('SELECT * FROM admin where email=? AND password=?', [req.body.email,req.body.password], function (error, results, fields) {
      if (error) throw error;
      if (Object.entries(results).length > 0) {
       	// return res.send({ error: false, data: "THERE'S NO such admin whose email is ="+req.body.email, message: 'THERE is NO such admin' });
      	// console.log("no such admin");
      	req.session.loggedin = true;
		req.session.email = email;
		return  res.redirect('/admin/admin_dashboard');
		// res.writeHead(302, {
		//   'Location': '/admin/admin_dashboard'
		//   //add other headers here...
		// });
		console.log("email =>",req.body.email,"password => ",req.body.password);
      }else{
      	res.send('Incorrect Username and/or Password!');
       	// return res.redirect('/admin/admin_dashboard.ejs');
       }
       res.end();
   
     });

}else{
	res.send('Please enter Username and Password!');
	res.end();
}

});


//EXPORTS
module.exports = router;