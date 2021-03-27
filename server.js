var express = require("express");
var session = require('express-session');
const path = require('path');
var cookie = require('cookie');
const bodyParser = require('body-parser');
const loginRouter = require('./modules/loginRouter');
const familyRouter = require('./modules/familyRouter');
const recipeRouter = require('./modules/recipeRouter');
const settingsRouter = require('./modules/settingsRouter');
var crypto = require('crypto');
const util = require('util');
var dbcon = null;
try
{
	dbcon = require("./modules/dbLocalConnection");
}
catch(err)
{
	dbcon = require("./modules/dbConnection");
}

const sleep = util.promisify(setTimeout);
const PORT = process.env.PORT || 8080;


var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());

//app.use(verifyUser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: "This is secret", saveUninitialized: true, resave: true}));

app.use(logRequest);

app.set("view engine", "ejs");

app.get('/', (req, res) => {
	res.locals.user = req.session;
	res.render('pages/index');

});

app.use('/user/auth', loginRouter);
app.use('/family', familyRouter);
app.use('/recipes', recipeRouter);
app.use('/settings', settingsRouter);


function logRequest(req, res, next)
{
	console.log(req.url);
	next();
}

function verifyUser(req, res, next)
{
	if (req.session.loggedin == true)
		next();
	else
		redirect('/');
}






app.listen(PORT, function(){console.log("the server is up");});
