var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var passport = require('passport');


const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'zen',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});



/* GET home page. */
router.get('/', function(req, res){
  console.log(req.users);
  console.log(req.isAuthenticated())
  res.render('home',{title: 'home'});
});

router.get('/profile', authenticationMiddleware(),function(req, res){
  res.render('profile',{title:'profile'});
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

router.get('/testpage', function(req, res){
  res.render('testpage')
});

router.get('/complaintou', function(req, res){
  res.render('complaintou')
});


router.post('/login', passport.authenticate(
    'local',{
      successRedirect: '/profile',
      failureRedirect: '/login'

}));

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registration' });
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
    if(errors){

      console.log(`errors: ${JSON.stringify(errors)}`);

      res.render('register', {
        title: 'Registration Error',
        errors: errors
      } );
    } else {
      const first_name = req.body.first_name;
      const last_name = req.body.last_name
      const email = req.body.email;
      const username = req.body.username;
      const whyOU = req.body.whyOU;
      const password = req.body.password;

      const db = require('../db.js');
      //MAKE QUERY TO POST DATA TO database
      db.query('INSERT INTO users (first_name, last_name, email, username, password, whyOU) VALUES (?,?,?,?,?,?)', [first_name, last_name, email, username, password, whyOU], function(error, results, fields){
        if(error) throw error;

          db.query('SELECT LAST_INSERT_ID() as users_id', function(error, results, fields){
              if(error) throw error;

              const users_id = results[0];
              console.log("bbb");
              //console.log(results[0]);
              req.login(users_id ,function(err){
                  res.redirect('/login');

              });
          })
      })
    }


});

passport.serializeUser(function(users_id, done) {
  done(null, users_id);
});

passport.deserializeUser(function(users_id, done) {
    done(null, users_id);
});
  function authenticationMiddleware(){
    return (req, res, next)=>{
      console.log( `req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

      if (req.isAuthenticated()) return next();
      res.redirect('/profile')
    }
  }
module.exports = router;
