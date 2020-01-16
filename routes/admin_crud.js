const express = require('express');
const router = express.Router();
var session = require('express-session');
// const config = require('../config/database.js');
var sess; // global session, NOT recommended

var mysql = require('mysql');
// connection configurations
 var dbConn = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'goaid_admin'
 });

dbConn.connect();
router.get('/',(req,res) => {
	// res.send("hi how r u ?")
	sess = req.session;
    if(sess.email) {
    	console.log("successfully7 email set =>",sess);
        return res.render('/admin/add_admin');
    }else{
	res.render('admin/login.ejs');
	}
});

router.get('/admin/add_admin',(req,res) => {
	// res.send("hi how r u ?")
	
	res.render('admin/login.ejs');
});
module.exports = router;
