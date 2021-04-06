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

		var results = await client.query("select recipeid, recipename, ingredients, recipe from recipes as r inner join users as u on r.userid = u.userid where u.userid = " + userid + ";");
		client.release();
		var recipes = results.rows;

		res.render('pages/recipes', {'loggedin': req.session.loggedin, 'recipes':recipes});
	}
	else
	{
		res.redirect('/');
	}
});

router.get('/recipe', async (req, res) => {
	var id = Number(req.query.recipeid);
	
	const client = await dbcon.connect();
	var userid = req.session.userid;
	
	var results = await client.query("select userid, recipename, ingredients, recipe from recipes where recipeid = " + id + ";");
	var recipe_userid = results.rows[0]['userid'];
	if (recipe_userid == userid)
	{
		var newresults = await client.query("select recipename, ingredients, recipe from recipes where recipeid = " + id + ";");
		res.write(JSON.stringify(newresults.rows[0]));
		res.end();
	}
	else
	{
		res.write("Invalid Request");
		res.end();
	}
	client.release();
});





router.post('/add', async (req,res) => {
	if (req.session.loggedin == true)
	{
		try {
			const client = await dbcon.connect();
			var name = req.body.recipe_name;
			var ingredients = JSON.stringify(req.body.ingredients);
			var recipe = JSON.stringify(req.body.directions);
			
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

router.post('/update', async (req,res) => {
	if (req.session.loggedin == true)
	{
		try {
			
			var id = Number(req.body.recipeid);
			var name = req.body.recipe_name;
			var ingredients = JSON.stringify(req.body.ingredients);
			var directions = JSON.stringify(req.body.directions);

			const client = await dbcon.connect();
			var userid = req.session.userid;

			var results = await client.query("select userid from recipes where recipeid = " + id + ";");
			var recipe_userid = results.rows[0]['userid'];
			
			if (recipe_userid == userid)
			{
				await client.query("UPDATE recipes SET recipename = '" + name + "', recipe = '" + directions + "', ingredients = '" + ingredients + "' WHERE recipeid = " + id + ";");
				
				res.write("Recipe Updated");
				res.end();
			}
			else
			{
				res.write("Invalid Request");
				res.end();
			}
			client.release();
			
		}
		catch (err) {
			console.log(err)
		}
	}
});

router.post('/delete', async (req,res) => {
	if (req.session.loggedin == true)
	{
		try {
			
			var id = Number(req.body.recipeid);

			const client = await dbcon.connect();
			var userid = req.session.userid;

			var results = await client.query("select userid from recipes where recipeid = " + id + ";");
			var recipe_userid = results.rows[0]['userid'];
			
			if (recipe_userid == userid)
			{
				await client.query("DELETE FROM recipes WHERE recipeid = " + id + ";");
				
				res.write("Recipe Deleted");
				res.end();
			}
			else
			{
				res.write("Invalid Request");
				res.end();
			}
			client.release();
			
		}
		catch (err) {
			console.log(err)
		}
	}
});

module.exports = router;