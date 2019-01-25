/**
* Module dependencies.
*/
var express = require('express');
const helmet = require('helmet')
var routes = require('./routes');
var user = require('./routes/user');
var path = require('path');
var session = require('express-session');
var expressValidator = require('express-validator');
var app = express();
app.use(helmet());
var mysql      = require('mysql');
var fileUpload = require('express-fileupload');
var bodyParser=require("body-parser");
require('dotenv').load();
const PORT = process.env.PORT;
var mysql      = require('mysql');
var connection = mysql.createConnection({
              host     : process.env.hostmysql,
              user     : process.env.usermysql,
              password : process.env.passwordmysql,
              database : process.env.databasemysql
            });
global.db = connection;
console.log("Connected to database!");
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(fileUpload()); // configure fileupload
app.use(expressValidator());
var cookieParser = require('cookie-parser');
app.use(cookieParser());
//var pdf = require('pdf');
//var moment = require('moment');
//app.use(username());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    //secure: true,
    httponly: true,
    maxAge: 60 * 60 * 1000 }
  }
));
//security checking admin
// development only
app.get('/', routes.index);//call for main index-user page all
app.post('/', routes.index);//call for main index-user page all
app.get('/login', routes.index);//call for login page all
app.post('/login', user.login);//call for login post all
app.get('/logout', user.logout);//call for logout all
app.get('/dashboard', user.dashboard);//call for dashboard page user
app.get('/dash-admin', user.dashadmin);//call for logout all
app.get('/profile',user.profile);//to render users profile user
app.get('/profile/edit/:id',user.editPageProfile);//to edit users profile user
app.post('/profile/edit/:id',user.editUserProfile);//to edit users profile user
app.get('/utilizatori-admin',user.utilizatori_admin);//to render users admin
//admin pages
app.get('/utilizatori-admin/edit/:id',user.utilizatori_editPage);//to show users Page admin
app.post('/utilizatori-admin/edit/:id',user.utilizatori_editUser);//to edit users Page admin
app.get('/utilizatori-admin/delete/:id', user.deleteUser);//delete user from users admin
app.get('/utilizatori-add', user.utilizatori_add);//add users new for admin Page admin
app.post('/utilizatori-add', user.utilizatori_add);//add users new dor admin post admin

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
