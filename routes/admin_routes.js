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

// GoAid website  database start
 var dbConn2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'goaid',
    debug: false,
    multipleStatements: true
 });

dbConn2.connect();

// GoAid website  database end
router.get('/login',(req,res) => {
	// res.send("currently on login page");
	sess = req.session;
    if(sess.email) {
    	console.log("successfully7 email set =>",sess);
        return res.redirect('/admin/admin_dashboard');
    }else{
	res.render('admin/login.ejs');
	}
});
//map longitude latitude start
// return res.render('admin/admin_dashboard.ejs',{
//             current_admin:sess
//         });
//map long lat end
router.get('/admin_dashboard',(req,res) => {
	sess = req.session;
    if(true) {
    	console.log("successfully email set =>",sess);
        dbConn2.query('SELECT long_lat FROM reg where long_lat IS NOT NULL',(error , results , fields) => {
            if(error){console.log(error);}
            return res.render('admin/admin_dashboard.ejs',{
                long_lats:results,
                current_admin:sess
            });
            // res.send({
            //     long_lat:results[0].long_lat.slice(10,31).split(","),
            //     long:results[0].long_lat.slice(10,31).split(",")[0],
            //     lat:results[0].long_lat.slice(10,31).split(",")[1]

            // });
        });
        
    }else{
	return res.redirect('/admin/login');
	}
});
// START
router.get('/dashboard_map',(req,res) => {
    sess = req.session;
    if(true) {
        console.log("auto refresh",sess);
        dbConn2.query('SELECT long_lat FROM reg where long_lat IS NOT NULL',(error , results , fields) => {
            if(error){console.log(error);}
            // return res.render('admin/admin_dashboard.ejs',{
            //     long_lats:results,
            //     current_admin:sess
            // });
            res.render('partials/dashboard_map.ejs',{
                long_lats:results,
                current_admin:sess
            });
        });
        
    }else{
    return res.redirect('/admin/login');
    }
});

//END
router.post('/login/admin_dashboard',(req,res) => {
	sess = req.session;
    sess.email = req.body.email;
    console.log("inside session =>",sess.email);
    // res.end('done');
	// req.body.email,req.body.password
	var email = req.body.email;
	var password = req.body.password;
	if (email && password) {
		dbConn.query('SELECT * FROM admin where email=? AND password=?', [req.body.email,req.body.password], function (error, results, fields) {
	      if (error) throw error;
	      if (Object.entries(results).length > 0) {
	      	req.session.loggedin = true;
			req.session.email = email;
			console.log("redirecting to  =>" ,req.path)
			return  res.redirect('/admin/admin_dashboard');
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

//LOGOUT
router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log("error =>",err);
        }
        res.redirect('/admin/login');
    });

});

//GET ADD ADMIN FORM
router.get('/add_admin',(req,res) => {
	// res.send("hi how r u ?")
	sess = req.session;
    if(sess.email) {
    	console.log("add admin page =>",sess);
        return res.render('admin/add_admin',{
        	current_admin:sess
        });

    }else{
	res.render('admin/login.ejs');
	}
});

//GET EDIT ADMIN FORM
router.get('/edit_admin/:id',(req,res) => {
	// res.send("hi how r u ?")
	sess = req.session;
    if(sess.email) {
    	console.log("edit admin page =>",sess);
        // return res.render('admin/add_edit_admin',{
        // 	current_admin:sess
        // });
        dbConn.query('SELECT * FROM admin where id=?',[req.params.id],(error,admin,fields) => {
        	// res.send(results);
        	if (error) throw error;
            var admin = admin;
            res.render('admin/edit_admin',{
        		admin:admin,
        		current_admin:sess
        	});
            console.log("admin =>>>>>>>",admin[0].email);
        });
    }else{
	    res.render('admin/login.ejs');
	}
});

//CREATE ADMIN
router.post('/add_admin', function (req, res) {
    admin_data = req.body;
     // console.log(user)
     if (!admin_data) {
       return res.render('admin/add_admin',{
       	empty_form:'Empty data cannot be submitted'
       });
     }
    dbConn.query("INSERT INTO admin SET ? ", { email: admin_data.email,password:admin_data.password }, function (error, results, fields) {
    if (error) throw error;
     return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
     });
});


//ADMIN LIST
router.get('/admins',(req,res) => {
	// res.send(req.session);
	sess = req.session;
	// console.log()
	if (sess.email) {
		dbConn.query('SELECT * FROM admin',(error, admins, fields) => {
	        if (error) throw error;
	         // return res.send({ error: false, data: results, message: 'users list.' });
		    res.render('admin/admins',{
				current_admin:sess,
				admins:admins
			});
	     });
		
	}else{
	res.render('admin/login.ejs');
	}

});

//update ADMIN
router.post('/edit_admin/:id', function (req, res) {
    admin_data = req.body;
     // console.log(user)
     if (!admin_data) {
       return res.render('admin/add_admin',{
       	empty_form:'Empty data cannot be submitted'
       });
     }
    dbConn.query("UPDATE admin SET email = ? , password = ?   WHERE id = ?", [admin_data.email,admin_data.password, req.params.id], function (error, results, fields) {
    if (error) {console.log(error)};
     res.redirect('/admin/admins');
     });
});

//GET AND DELETE THE ADMIN
router.get('/delete_admin/:id',(req,res) => {
    const id = req.params.id;
    dbConn.query('DELETE FROM admin WHERE id = ?', [id],(error,admin,fields) => {
        if (error) {console.log('error while deleting ===>>>>',error)}
        res.redirect('/admin/admins');
    });
});

//GET INQUIRIES

router.get('/queries',(req,res) => {
    // res.send("inquiries list")
    sess = req.session;
    if (sess.email) {
        // res.render('admin/queries',{
        //     current_admin:sess
        // });
        var sql = "SELECT * FROM tbl_need_ambulance;SELECT * FROM tbl_goaid_corporate;";
            sql+= "SELECT * FROM tbl_partner_enquiry;SELECT * FROM tbl_contact";
        dbConn2.query(sql,(error,results,fields) => {
            if (error) {console.log("RETRIEVING ERROR =====>>>>",error)}
            var tbl_need_ambulance = results[0];
            var tbl_goaid_corporate = results[1];
            var tbl_partner_enquiry = results[2];
            var tbl_contact = results[3];
            res.render('admin/queries',{
                current_admin:sess,
                contact_queries:tbl_contact,
                corporate_queries:tbl_goaid_corporate,
                booking_queries:tbl_need_ambulance,
                partner_queries:tbl_partner_enquiry
            });
        });
    }else{
        res.render('admin/login');
    }

});

//EXPORTS
module.exports = router;