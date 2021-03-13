var express = require("express");
var session = require('express-session');
const path = require('path');
var cookie = require('cookie');
const util = require('util');
const bodyParser = require('body-parser');
var dbcon = require("./dbConnection");
var crypto = require('crypto');

const sleep = util.promisify(setTimeout);
const PORT = process.env.PORT || 80;


var app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: "This is secret", saveUninitialized: true, resave: true}));
app.set('views', path.join(__dirname, 'views'))


app.set("view engine", "ejs");

app.get('/', (req, res) => {
	if (typeof(req.session.message) != 'undefined')
		res.render('pages/index', {'loggedin': (req.session.loggedin == true), 'message': req.session.message});
	else
		res.render('pages/index', {'loggedin': (req.session.loggedin == true), 'message': ""});
});


app.get("/recipes",async (req,res) => {
	if (req.session.loggedin == true)
	{
		const client = await dbcon.connect();
		var userid = req.session.userid;

		var results = await client.query("select recipename, ingredients, recipe from recipes as r inner join users as u on r.userid = u.userid where u.userid = " + userid + ";");
		client.release();
		var recipes = results.rows;
		console.log(recipes[0]);
		res.render('pages/recipes', {'loggedin': req.session.loggedin, 'recipes':recipes});
	}
	else
	{
		res.redirect('/');
	}
});

app.post('/user/login', async (req,res) => {
	try {

		var salt = "";
		const client = await dbcon.connect();
		const username = req.body.username;

		var result = await client.query("SELECT salt FROM users where username = '" + username + "';");
		if (typeof(result.rows[0]) != 'undefined')
			salt = result.rows[0].salt;


		const password = generate_pass_hash(req.body.password, salt);
		await sleep(250);
		result = await client.query("SELECT userid FROM users where username = '" + username + "' and hash_pass = '" + password + "';");
		if (typeof(result.rows[0]) != 'undefined')
		{
			var userid = result.rows[0].userid;

			req.session.loggedin = true;
			req.session.userid = userid;
			req.session.message = "";
			res.redirect('/');
		}
		else
		{
			req.session.loggedin = false;
			req.session.userid = 0;
			req.session.message = "Incorrect Password";
			res.redirect('/');
		}
		client.release();
	}
	catch (err) {
	 console.log(err)
	}
});

app.post('/user/logout', (req,res) => {
	req.session.destroy();
	res.redirect('/');

});

app.post('/recipes/add', async (req,res) => {
	if (req.session.loggedin == true)
	{
		try {
			const client = await dbcon.connect();
			var name = req.body.recipe_name;
			var ingredients = req.body.ingredients;
			var recipe = req.body.directions;

			var userid = req.session.userid;

			await client.query("INSERT INTO recipes (userid, recipe, recipename, ingredients) VALUES ('"+userid+"', '" + recipe + "', '" + name + "', '" + ingredients + "');");
			client.release();
			res.redirect('/recipes');
		}
		catch (err) {
			console.log(err)
		}
	}
});

app.post('/user/signup', async (req,res) => {
	try {
		const client = await dbcon.connect();
		const username = req.body.username;


		if (await does_user_exist(username))
		{
			const salt = crypto.randomBytes(16).toString('base64').toString();
			const password = generate_pass_hash(req.body.password, salt);
			await client.query("INSERT INTO users (username, hash_pass, salt) VALUES ('"+username+"', '" + password + "', '" + salt + "');");

			var result = await client.query("SELECT userid FROM users where username = '" + username + "' and hash_pass = '" + password + "';");
			var userid = result.rows[0].userid;

			res.setHeader('Set-Cookie', cookie.serialize('userid',userid));
			req.session.userid = userid;
			req.session.loggedin = true;
			res.redirect('/');

		}
		else
		{
			req.session.loggedin = false;
			req.session.userid = 0;
			console.log('user exists');
		}

		client.release();
	}
	catch (err) {
	 console.log(err)
	}
});

function generate_pass_hash(password, salt) {
	return crypto.createHash('RSA-SHA256').update(password).update(salt).digest('hex');
}

async function does_user_exist(username) {
	const client = await dbconnect.connect();
	var result = await client.query("SELECT * FROM users where username = '" + username + "';");

	client.release();
	console.log(typeof(result.rows[0]) != 'undefined');
	return (typeof(result.rows[0]) == 'undefined');
}



app.listen(PORT, function(){console.log("the server is up");});
