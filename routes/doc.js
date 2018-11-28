function getDocs(req, res, db) {
   
    db.query("SELECT * FROM documents;", (error, results) => {
        if(error) throw error;
        res.json(results);
        console.log(results);
    });

}

exports.getDocs = getDocs;