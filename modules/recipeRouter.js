var express= require('express');
var router = express.Router();
var session = require('express-session');
var cookie = require('cookie');
var crypto = require('crypto');

const util = require('util');

var dbcon = null;
try 
{
	dbcon = require("./dbLocalConnection");
} 
catch(err)
{ 
	dbcon = require("./dbConnection");
}

router.get("/",async (req,res) => {
	req.session.current_page = "/recipes";
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





router.post('/add', async (req,res) => {
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

module.exports = router;