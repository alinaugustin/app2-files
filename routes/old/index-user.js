module.exports = {
    getUserPage: (req, res) => {
        let query = "SELECT * FROM `users` ORDER BY id ASC"; // query database to get all the players
        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/user');
            }
            res.render('index-user.ejs', {
                title: "App data users!"
                ,users: result
            });
        });
    },
};