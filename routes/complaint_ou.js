const db = require('../db.js');
const express = require('express');
const complou_router = express.Router();

/*
module.exports = {
	func1: function() {
		complou_router.get('/complaint_ou', function(req, res) {
			res.render('complaintou')
		});
	},
	func2: function() {
		complou_router.post((req, res, next) => {
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

	}
};

*/

module.exports = {
	func1: function() {
		complou_router.get('/complaint_ou', function(req, res) {
			res.render('complaintou')
		});
	},
	func2: function() {
		complou_router.post((req, res, next) => {
			const text = req.body.text;
			const username = req.body.username;
			var username_query = "SELECT id FROM users WHERE username =?;";
			var insert_query = "INSERT INTO complaints(user_id,comment_text, complaint_type) VALUES (?,?, 'OU');";
			db.query(username_query, [username], (err, results, field) => {
				if (err) throw err;
				var test_id = results[0].id;

				db.query(insert_query, [test_id, text], (err, results, field) => {
					if (err) throw err;
					res.redirect('/') //redirect to document panel
				});
			});
		});

	}
};