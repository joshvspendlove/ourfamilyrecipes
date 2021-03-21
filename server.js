var express = require("express");
var session = require('express-session');
const path = require('path');
var cookie = require('cookie');
const bodyParser = require('body-parser');
var dbcon = require("./modules/dbLocalConnection") || require("./modules/dbConnection");
const loginRouter = require('./modules/loginRouter');
const familyRouter = require('./modules/familyRouter');
var crypto = require('crypto');
const util = require('util');

const sleep = util.promisify(setTimeout);
const PORT = process.env.PORT || 8080;


var app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: "This is secret", saveUninitialized: true, resave: true}));
app.set('views', path.join(__dirname, 'views'))


app.set("view engine", "ejs");

app.get('/', (req, res) => {
	res.locals.user = req.session;
	res.render('pages/index');

});

app.use('/user/auth', loginRouter);
app.use('/family', familyRouter);

app.get("/recipes",async (req,res) => {
	res.locals.user = req.session;
	if (req.session.loggedin == true)
	{

		const client = await dbcon.connect();
		var userid = req.session.userid;

		var results = await client.query("select recipename, ingredients, recipe from recipes as r inner join users as u on r.userid = u.userid where u.userid = " + userid + ";");
		client.release();
		var recipes = results.rows;

		res.render('pages/recipes', {'loggedin': req.session.loggedin, 'recipes':recipes});
	}
	else
	{
		res.redirect('/');
	}
});





app.post('/recipes/add', async (req,res) => {
	if (req.session.loggedin == true)
	{
		try {
			const client = await dbcon.connect();
			var name = req.body.recipe_name;
			var ingredients = JSON.stringify(req.body.ingredients);
			var recipe = req.body.directions;

			var userid = req.session.userid;

			await client.query("INSERT INTO recipes (userid, recipe, recipename, ingredients) VALUES ('"+userid+"', '" + recipe + "', '" + name + "', '" + ingredients + "');");
			client.release();
			res.write('Recipe Added');
			res.end();
		}
		catch (err) {
			console.log(err)
		}
	}
});






app.listen(PORT, function(){console.log("the server is up");});
