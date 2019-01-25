//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   //var session = req.session;
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var bcryptF = require('bcrypt');
      var hash = "SELECT password FROM `users` WHERE `user_name`='"+name+"' ";
      db.query(hash, function(err, results){
         if(results){
            var hashed = results[0].password;
            //console.log("hash=",hashed);
            var verifyPass = bcryptF.compareSync(pass, hashed);
            //console.log("verifyPass=",verifyPass);
            var sql="SELECT id, first_name, last_name, user_name, rol FROM `users` WHERE `user_name`='"+name+"' ";
            if(verifyPass){
            db.query(sql, function(err, results) {
               if (err) throw err;
               //console.log(results);
               req.session.userId = results[0].id;
               req.session.user = results[0];
               var user = req.session.user;
               //console.log("user:",user);
               req.session.userRol = user.rol;
               req.session.userName = user.user_name;
               //console.log('userId=',req.session.userId);
               //console.log('userRol=',req.session.userRol);
               //console.log('userName=',req.session.userName);
               var fs = require('fs');
               var datatimp = Date.now();
               //var datatimp = Date().getTime();
               fs.appendFile('logusers.txt', datatimp+" ID: "+user.id+"   ROL: "+user.rol+" UTILIZATOR: "+user.user_name+" \r\n", function (err) {
               if (err) throw err;
               //console.log('Saved!');
               });
               if(user.rol == 'user') {
                  res.redirect('/dashboard');
                  res.end();
                  } else {
                     res.redirect('/dash-admin');
                     res.end();
                  }
               });
               } else {
                  message = 'Credentiale gresite! Ati introdus utilizatorul/parola gresit.';
                  console.log("results:",results[0].user_name);
                  res.render('index.ejs',{message: message});
                  }
            } else {
               message = 'Eroare de conectare.';
               throw err;
               console.log("results:",results[0].user_name);
               console.log("results:",results[0].password);
               res.render('index.ejs',{message: message});
            }
      });
   } else {
      res.render('index.ejs',{message: message});
   }
};
//--------checkadmin
exports.checkadmin = function() {
   var userId = req.session.userId;
   if(userId == null ){
      res.redirect("/login");
      return;
   } else {
      var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userId+"' ";
      db.query(sqlnonad, function(err, result){
         if (err) {
            res.redirect("/login");
            return 0;
            //return res.status(500).send(err);
         }
         var rezult_rol = result[0].rol;
        //console.log('rezult_rol:',rezult_rol);
         if(rezult_rol != 'admin') {
            res.redirect("/login");
            return 0;
        }
      });
      return 1;
   }
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
exports.dashboard = function(req, res, next){
   var user =  req.session.user,
   userId = req.session.userId;
   //console.log('dashboard.userId=',userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});
   });
};
//-----------------------------------------------dashboard ADMIN page functionality----------------------------------------------
exports.dashadmin = function(req, res){
   //var user =  req.session.user,
   //userId = req.session.userId;
   //console.log('dash-admin.userId=',userId);
   var user =  req.session.user,
   userId = req.session.userId;
   if(userId == null ){
      res.redirect("/login");
      return;
   }
   if(user.rol != 'admin' ){
      res.redirect("/dashboard");
      return;
   }
   res.render('dashadmin.ejs');
};
//-----------------------------------------------INSTRUCTIUNI page functionality----------------------------------------------
exports.instructiuni = function(req, res){
   //var user =  req.session.user,
   userId = req.session.userId;
   //console.log('dash-admin.userId=',userId);
   var userId = req.session.userId;
   if(userId == null ){
      res.redirect("/login");
      return;
   }
   res.render('instructiuni.ejs');
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   });
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, result){
      res.render('profile.ejs',{data:result});
   });
};
//----------------------------------show users all --------------------------------------
exports.utilizatori_admin = function(req, res){
   var userId = req.session.userId;
   if(userId == null ){
      res.redirect("/login");
      return;
   } else {
      var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userId+"' ";
      db.query(sqlnonad, function(err, result){
         if (err) {
            res.redirect("/login");
            return;
            //return res.status(500).send(err);
         }
         var rezult_rol = result[0].rol;
         //console.log('rezult_rol:',rezult_rol);
         if(rezult_rol != 'admin')
            {res.redirect("/login");
            return;
          }
      });
   }
   var sql="SELECT * FROM `users` ";
   db.query(sql, function(err, result){
      var utilizatori = result;
      //console.log('utilizatori:',utilizatori);
      res.render('utilizatori_admin.ejs',{utilizatori:result});

   });
};
//---------------------------------delete users----------------------------------
exports.deleteUser=function(req,res){
   var userId = req.session.userId;
   if(userId == null ){
      res.redirect("/login");
      return;
   } else {
      var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userId+"' ";
      db.query(sqlnonad, function(err, result){
         if (err) {
            res.redirect("/login");
            //return;
            //return res.status(500).send(err);
         }
         var rezult_rol = result[0].rol;
         //console.log('rezult_rol:',rezult_rol);
         if(rezult_rol != 'admin') {
            res.redirect("/login");
            return;
        }
      });
   }
   console.log('userId=',userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var userIddel = req.params.id;
   console.log('deleteprofile:: userIddel=',userIddel);
   var deleteUserQuery = 'DELETE FROM users WHERE id = "' + userIddel + '"';
   db.query(deleteUserQuery, function(err, result){
   if (err) {
      message = 'S-a ivit o eroare. Profilul nu a fost sters';
      res.render('utilizatori_admin.ejs',{message: message});
      }
   res.redirect('/utilizatori-admin');
   });
};
//---------------------------------new add users ----------------------------------
exports.utilizatori_add=function(req,res){
   var userId = req.session.userId;
   if(userId == null ){
      res.redirect("/login");
      return;
   } else {
      var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userId+"' ";
      db.query(sqlnonad, function(err, result){
         if (result[0].rol != 'admin') {
            res.redirect("/login");
            return;
            //return res.status(500).send(err);
         }  else {
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var username= post.user_name;
      var pass= post.password;
      var firstname= post.first_name;
      var lastname= post.last_name;
      var mobno= post.mob_no;
      var e_mail = post.email;
      var rrol= post.rol;
      var bcrypt = require("bcrypt");
      var passcrypt = bcrypt.hashSync(pass, 10);
      var sqlimport ="SELECT * FROM `users` WHERE `user_name`='"+username+"' ";
      if(post && username && pass && firstname && lastname && mobno && e_mail && pass && rrol) {
      db.query(sqlimport, function(err, results) {
         console.log("results",results);
      if(results.length) {
         message = 'Utilizatorul exista. Va rugam sa va conectati!';
         res.render('index.ejs',{message: message});
      } else {
         var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`,`email`,`password`,`rol`) VALUES ('" + firstname + "','" + lastname + "','" + mobno + "','" + username + "','" + e_mail + "','" + passcrypt + "','" + rrol + "')";
         var query = db.query(sql, function(err, result) {
         message = "Succes! Contul a fost creat.";
         res.render('utilizatori_add',{message: message});
      });
      }
   });
   }
   else {
      message = 'Trebuie sa completati toate casutele!';
      res.render('utilizatori_add.ejs',{message: message});
   }
   } else {
      res.render('utilizatori_add');
   }
   }
   });
   }
};
//---------------------------------edit users details after login----------------------------------
exports.editPageProfile=function(req,res){
   var userId = req.params.id;
   var query = "SELECT * FROM `users` WHERE id = '" + userId + "' ";
   db.query(query, function(err, result){
       if (err) {
           return res.status(500).send(err);
       }
       res.render('edituser.ejs', {title: "Edit  User",user: result[0],message: ''});
   });
};
//--userProfile edit user profile users
exports.editUserProfile=function(req,res){
   var userId = req.params.id;
   var first_name = req.body.first_name;
   var last_name = req.body.last_name;
   var mob_no = req.body.mob_no;
   var newpass = req.body.password;
   var bcrypt = require("bcrypt");
   var passcrypt = bcrypt.hashSync(newpass, 10);
   var query = "UPDATE `users` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `mob_no` = '" + mob_no + "', `password` = '" + passcrypt + "' WHERE `users`.`id` = '" + userId + "'";
   db.query(query, function(err, result){
       if (err) {
           return res.status(500).send(err);
       }
       res.redirect('/profile');
   });
};
//-----utilizatori edit Page admin
exports.utilizatori_editPage=function(req,res){
    var userIdutiliz = req.session.userId;
   if(userIdutiliz == null ){
    res.redirect("/login");
    return;
    } else {
    var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userIdutiliz+"' ";
    db.query(sqlnonad, function(err, result){
       if (err) {
          res.redirect("/login");
          //return;
          //return res.status(500).send(err);
       }
       var rezult_rol = result[0].rol;
       //console.log('rezult_rol:',rezult_rol);
       if(rezult_rol != 'admin') {
          res.redirect("/login");
          return;
      }
    });
   }
   message = '';
   var userId = req.params.id;
   var query = "SELECT * FROM `users` WHERE id = '" + userId + "' ";
   db.query(query, function(err, result){
       if (err) {
           return res.status(500).send(err);
       }
       res.render('utilizatori_edit.ejs', {title: "Edit  User",user: result[0],message:message});
   });
};
//--------utilizatori admin
exports.utilizatori_editUser=function(req,res){
    var userIdutiliz = req.session.userId;
   if(userIdutiliz == null ){
    res.redirect("/login");
    return;
    } else {
    var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userIdutiliz+"' ";
    db.query(sqlnonad, function(err, result){
       if (err) {
          res.redirect("/login");
          //return;
          //return res.status(500).send(err);
       }
       var rezult_rol = result[0].rol;
       //console.log('rezult_rol:',rezult_rol);
       if(rezult_rol != 'admin') {
          res.redirect("/login");
          return;
      }
    });
}
    var userId = req.params.id;
   var first_name = req.body.first_name;
   var last_name = req.body.last_name;
   var mob_no = req.body.mob_no;
   var newpass = req.body.password;
   var bcrypt = require("bcrypt");
   var passcrypt = bcrypt.hashSync(newpass, 10);
   var query = "UPDATE `users` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `mob_no` = '" + mob_no + "', `password` = '" + passcrypt + "' WHERE `users`.`id` = '" + userId + "'";
   db.query(query, function(err, result){
       if (err) {
           return res.status(500).send(err);
       }
       res.redirect('/utilizatori-admin');
   });

};
