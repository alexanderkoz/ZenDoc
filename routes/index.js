var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var passport = require('passport');
const db = require('../db.js');
var compl_ou = require('./complaint_ou');

/* GET home page. */
router.get('/', function(req, res) {
	console.log(req.user);
	console.log(req.isAuthenticated())
	res.render('home', {
		title: 'home'
	});
});

router.get('/profile', authenticationMiddleware(), function(req, res) {
	res.render('profile', {
		title: 'profile'
	});
});

router.get('/login', function(req, res) {
	res.render('login', {
		title: 'Login'
	});
});
router.get('/test', function(req, res) {
	res.render('test')
});

router.get('/complaintdoc', function(req, res) {
	res.render('complaintdoc')
});
//Get for complaint_ou

router.get('/complaintou', function(req, res) {
	res.render('complaintou')
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

//Complaint form

//router.post('/complaint', function(req, res, next) {
//const text = req.body.text;
//const file_name = req.body.file_name;

//db.query("INSERT INTO complaints(file_name,comment_text) VALUES (?,?);", [file_name, text], (err, results, field) => {
//if (err) throw err;
//res.redirect('/') //redirect to document panel
//});
//});

//****************************

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



router.post('/register', function(req, res, next) {
	//checn input if its valid
	req.checkBody('username', 'Username field cannot be empty.').notEmpty();
	req.checkBody('username', 'Username field cannot be empty.').notEmpty();
	req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
	//req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
	//req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
	req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
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

		const username = req.body.username;
		const whyOU = req.body.whyOU;
		const password = req.body.password;


		//MAKE QUERY TO POST DATA TO database
		db.query('INSERT INTO user (username, password, whyOU) VALUES (?,?,?)', [username, password, whyOU], function(error, results, fields) {
			if (error) throw error;

			db.query('SELECT LAST_INSERT_ID() as user_ID', function(error, results, fields) {
				if (error) throw error;

				const user_id = results[0];

				console.log(results[0]);
				req.login(user_id, function(err) {
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
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

		if (req.isAuthenticated()) return next();
		res.redirect('/profile')
	}
}
module.exports = router;