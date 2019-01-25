const fs = require('fs');

module.exports = {
    addPlayerPage: (req, res) => {
        res.render('add-player.ejs', {
            title: "Bine ati venit! ||| Adaugati noi date!"
            ,message: ''
        });
    },
    addPlayer: (req, res) => {

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;
        let username = req.body.username;

        let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-player.ejs', {
                    message,
                    title: "Bine ati venit! ||| Adaugati noi date!"
                });
            } else {
                let query = "INSERT INTO `players` (first_name, last_name, position, number, user_name) VALUES ('" + first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });       
            }
        });
    },

    editPlayerPage: (req, res) => {
                let playerId = req.params.id;
                let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
                db.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.render('edit-player.ejs', {
                        title: "Edit  Player"
                        ,player: result[0]
                        ,message: ''
                    });
                });
    },
    editPlayer: (req, res) => {
                let playerId = req.params.id;
                let first_name = req.body.first_name;
                let last_name = req.body.last_name;
                let position = req.body.position;
                let number = req.body.number;
                let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
                db.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
    },
    deletePlayer: (req, res) => {
                let playerId = req.params.id;
                let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';
                        db.query(deleteUserQuery, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
       
    }    
};