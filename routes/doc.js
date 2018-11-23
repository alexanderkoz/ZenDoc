function getUsers(req, res, db) {
   
    db.query("SELECT * FROM users", (error, results) => {
        if(error) throw error;
        console.log("Here we are getting users");
        res.json(results);
    });
}

exports.getUsers = getUsers;