var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var passport = require('passport');

var mysql = require('../db');
var doc = require('./doc');
module.exports = function(db) {
  /* GET home page. */
  var files;

  router.get('/', function(req, res){
    db.query("SELECT * FROM documents;", (error, results) => {
      if(error) throw error;

      files = results.map(function(item) {
        item.url = "/document/" + item.doc_id
        return item;
      })
      console.log(files);
      res.render('home',{title: 'Zen Doc', files: files});
    });
    console.log(req.user);
    console.log(req.isAuthenticated())

  });

  router.get('/profile', authenticationMiddleware(),function(req, res){
    res.render('profile',{title:'profile'});
  });
  //var file;
  router.get('/document/:id', function(req, res) {
    var id = req.params.id;
    db.query("SELECT * FROM documents where doc_id = " + id, (error, results) => {
      if(error) throw error;
      file = results;
      res.render('doc', {title: 'Document', file:results[0]});
    });
});


	
  router.get('/login',function(req, res){
    res.render('login', {title: 'Login'});
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
  router.post('/login', passport.authenticate(
      'local',{
        successRedirect: '/profile',
        failureRedirect: '/login'

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


  router.post('/register', function(req, res, next) {
    //checn input if its valid
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    
    const errors = req.validationErrors();
      if(errors){

        console.log(`errors: ${JSON.stringify(errors)}`);

        res.render('register', {
          title: 'Registration Error',
          errors: errors
        } );
      } else {

        const username = req.body.username;
        const whyOU = req.body.whyOU;
        const password = req.body.password;

        //const db = require('../db.js');
        //MAKE QUERY TO POST DATA TO database
        db.query('INSERT INTO user (username, password, whyOU) VALUES (?,?,?)', [username, password, whyOU], function(error, results, fields){
          if(error) throw error;

            db.query('SELECT LAST_INSERT_ID() as user_ID', function(error, results, fields){
                if(error) throw error;

                const user_id = results[0];

                console.log(results[0]);
                req.login(user_id ,function(err){
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

    function authenticationMiddleware(){
      return (req, res, next)=>{
        console.log( `req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/profile')
      }
    }
    return router;
}

