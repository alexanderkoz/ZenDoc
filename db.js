const mysql = require('mysql')
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'zen',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

connection.connect(function(error) {
	if (error) {
		throw error;
	}
	console.log("Database is connected");
});

module.exports = connection;