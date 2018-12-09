var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var passport = require('passport');
var mysql = require('../db');
var doc = require('./doc');
module.exports = function(db) {
  /* GET home page. */

router.get('/', function(req, res){
  db.query("SELECT * FROM documents;", (error, results) => {
    if(error) throw error;

    files = results.map(function(item) {
      item.url = "/document/" + item.doc_id
      return item;
    })
    res.render('home',{title: 'Zen Doc', files: files.slice(files.length - 3, files.length)});
  });
  console.log(req.user);
  console.log(req.isAuthenticated())
});

router.get('/documents', function(req, res){
  db.query("SELECT * FROM documents;", (error, results) => {
    if(error) throw error;
    files = results.map(function(item) {
      item.url = "/document/" + item.doc_id
      return item;
    })
    res.json(files);
    });
});

router.get('/users', function(req, res){
  db.query("SELECT * FROM users;", (error, results) => {
    if(error) throw error;
    users = results.map(function(user) {
      user.url = "/user/" + user.id
      return user;
    })
    res.json(users);
    });
});

router.get('/profile', authenticationMiddleware(), function(req, res){


 // id =0, I dont know how to pass ID from app.js after login to here.
	db.query("SELECT first_name, last_name, username, email, whyOU, image_name  FROM users WHERE id =  0" , (error, results)=>{
		if (error){
			throw error;
		}
  res.render('profile',{results});
		console.log(results);
	})
});

router.get('/document/:id', function(req, res) {
  var id = req.params.id;
  db.query("SELECT * FROM documents where doc_id = " + id, (error, results) => {
    if(error) throw error;
    file = results;
    res.render('doc', {title: 'Document', file:results[0]});
  });
});

router.get('/user/:id', function(req, res) {
  var id = req.params.id;
  db.query("SELECT * FROM users where id = " + id, (error, results) => {
		if(error) throw error;
		var user = results[0];
		db.query("SELECT * FROM documents where user_id = " + id, (error, results) => {
			if(error) throw error;
			var docs = results;
			console.log(user);
			res.render('user', {title: 'UserPage', user:user, docs:docs});
		});
  });
});

router.get('/login',function(req, res){
  res.render('login', {title: 'Login'});
});

router.get('/logout',function(req, res){
  req.logout();
	req.session.destroy();
	res.redirect('/login');
});


router.get('/adminlogin', function(req, res){
  res.render('adminlogin', {title: 'Login'});
});

router.get('/test', function(req, res){
  res.render('test')
});

router.get('/complaintdoc', function(req, res){
  res.render('complaintdoc')
});

router.get('/complaintou', function(req, res){
  res.render('complaintou')
});

router.get('/testpage', function(req, res){
  res.render('testpage')
});

router.get('/adminpage', authenticationMiddleware(), function(req, res){
//router.get('/adminpage', function(req, res){
  res.render('adminpage', {title: 'AdminPage'});
});

router.get('/applications', function(req, res){
  db.query("SELECT * FROM users_application;", (error, results) => {
    if(error) throw error;
    users = results;
    res.render('applications', {title: 'Applications', users:users});
  });
});

router.delete('/applications/:id', function(req, res){
	var id = req.params.id;
  db.query("DELETE FROM users_application WHERE id = " + id, (error) => {
		if(error) throw error;
		res.send();
	});
});

router.get('/applications/:id', function(req, res) {
	var id = req.params.id;
	db.query(`INSERT INTO users SELECT * FROM users_application WHERE id = ${id};`, (error) => {
		if(error) throw error;
		db.query(`DELETE FROM users_application WHERE id = ${id};`, (error) => {
			if(error) throw error;
			res.send();
		})
	})
})

router.get('/complaints', function(req, res){
  db.query("SELECT * FROM complaints;", (error, results) => {
		if(error) throw error;
		var complaints = results;
		db.query("SELECT users.id, users.first_name, users.last_name from users INNER JOIN complaints ON users.id=complaints.user_id;", (error, results) => {
			if(error) throw error;
			var names = results;
			for (var i = 0; i < complaints.length; i++) {
				for (var j = 0; j < names.length; j++) {
					if (complaints[i].user_id === names[j].id) {
						complaints[i].first_name = names[j].first_name;
						complaints[i].last_name = names[j].last_name;
					}
				}
			}
			res.render('complaints', {title: 'Complaints', complaints:complaints});
		})

  });
});

router.post('/login', passport.authenticate(
  'local',{

    successRedirect: '/profile',
    failureRedirect: '/login'

}));

router.post('/adminlogin', passport.authenticate(
  'local',{
    successRedirect: '/adminpage',
    failureRedirect: '/adminlogin'

}));

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registration' });
});

//Complaint form to complain about a document

router.post('/complaint_doc', function(req, res, next) {
  const text = req.body.text;
  const file_name = req.body.file_name;
  db.query("SELECT doc_id FROM documents WHERE file_name =?;", [file_name], (err, results, field) => {
    if (err) throw err;
    var d_id = results[0].doc_id;

    db.query("INSERT INTO complaints(doc_id,file_name,comment_text, complaint_type) VALUES (?,?,?,'Doc');", [d_id, file_name, text], (err, results, field) => {
      if (err) throw err;
      res.redirect('/') //redirect to document panel
    });
  });
});

//Complaint Form to complain about OU
router.post('/complaint_ou', function(req, res, next) {
  const text = req.body.text;
  const username = req.body.username;
  db.query("SELECT id FROM users WHERE username =?;", [username], (err, results, field) => {
    if (err) throw err;
    var test_id = results[0].id;

    db.query("INSERT INTO complaints(user_id,comment_text, complaint_type) VALUES (?,?, 'OU');", [test_id, text], (err, results, field) => {
      if (err) throw err;
      res.redirect('/') //redirect to document panel
    });
  });
});

	router.get('/complaintou', function(req, res) {
		res.render('complaintou')
	});

	router.get('/doc_editor', function(req, res) {
		res.render('doceditor')
	});

	router.get('/testpage', function(req, res) {
		res.render('testpage')
	});

	router.post('/login', passport.authenticate(
		'local', {
			successRedirect: '/profile',
			failureRedirect: '/login'
	}));

	router.get('/register', function(req, res, next) {
		res.render('register', {
			title: 'Registration'
		});
	});

	//Complaint form to complain about a document

	router.post('/complaint_doc', function(req, res, next) {
		const text = req.body.text;
		const file_name = req.body.file_name;
		db.query("SELECT doc_id FROM documents WHERE file_name =?;", [file_name], (err, results, field) => {
			if (err) throw err;
			var d_id = results[0].doc_id;

			db.query("INSERT INTO complaints(doc_id,file_name,comment_text, complaint_type) VALUES (?,?,?,'Doc');", [d_id, file_name, text], (err, results, field) => {
				if (err) throw err;
				res.redirect('/') //redirect to document panel
			});
		});
	});

	//Complaint Form to complain about OU
	router.post('/complaint_ou', function(req, res, next) {
		const text = req.body.text;
		const username = req.body.username;
		db.query("SELECT id FROM users WHERE username =?;", [username], (err, results, field) => {
			if (err) throw err;
			var test_id = results[0].id;

			db.query("INSERT INTO complaints(user_id, comment_text, complaint_type) VALUES (?,?, 'OU');", [test_id, text], (err, results, field) => {
				if (err) throw err;
				res.redirect('/') //redirect to document panel
			});
		});
	});

	router.post('/register', function(req, res, next) {
		//checn input if its valid
		req.checkBody('username', 'Username field cannot be empty.').notEmpty();
		req.checkBody('username', 'Username field cannot be empty.').notEmpty();
		req.checkBody('username', 'Username must be between 4-15 characters long.').len(1, 15);
		req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
		req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
		//req.checkBody('password', 'Password must be between 8-100 characters long.').len(4, 100);
		//req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
		//req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
		//req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

		const errors = req.validationErrors();
		if (errors) {

			console.log(`errors: ${JSON.stringify(errors)}`);

			res.render('register', {
				title: 'Registration Error',
				errors: errors
			});
		} else {
			const first_name = req.body.first_name;
			const last_name = req.body.last_name
			const email = req.body.email;
			const username = req.body.username;
			const whyOU = req.body.whyOU;
			const image_name = req.body.image_name;
			const password = req.body.password;

			//const db = require('../db.js');
			//MAKE QUERY TO POST DATA TO database
			db.query('INSERT INTO users_application (first_name, last_name, email, username, password, image_name, whyOU) VALUES (?,?,?,?,?,?,?)', [first_name, last_name, email, username, password, image_name, whyOU], function(error, results, fields) {
				if (error) throw error;

				db.query('SELECT LAST_INSERT_ID() as users_id', function(error, results, fields) {
					if (error) throw error;

					const users_id = results[0];
					console.log("bbb");
					console.log(results[0]);
					req.login(users_id, function(err) {
						res.redirect('/login');

					});
				})
			})
		}
	});

	passport.serializeUser(function(user_id, done) {
		done(null, user_id);
	});


	passport.deserializeUser(function(user_id, done) {
		done(null, user_id);
	});

	function authenticationMiddleware() {
		return (req, res, next) => {
			console.log(`req.session.passport.users: ${JSON.stringify(req.session.passport)}`);

			if (req.isAuthenticated()) return next();
			res.redirect('/profile')
		}
	}
	return router;
}
