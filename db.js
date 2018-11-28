const mysql = require('mysql');

exports.config = function() {
	const connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'zen',
		port: '8889'
		//socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
	});
	
	connection.connect(function(error) {
		if (error) {
			throw error;
		}
		console.log("Database is connected");
	});
	return connection;
}
