var express= require('express');
var router = express.Router();
const path = require('path');
var session = require('express-session');
var cookie = require('cookie');
var dbcon = null;
try
{
	dbcon = require("./dbLocalConnection");
}
catch(err)
{
	dbcon = require("./dbConnection");
}

router.use(express.static(path.join(__dirname, '../public')));
router.get('/', async (req, res) => {
	req.session.current_page = "/family";
	req.session.subpage = "home";

	if (req.session.loggedin == true)
	{
		var userid = req.session.userid;
		req.session.results = await getFamilies(userid);
		res.locals.user = req.session;
		res.render('pages/family');
	}
	else
	{
		res.redirect('/');
	}

});
router.post('/modify/new', async (req,res) => {

	const client = await dbcon.connect();
	var userid = req.session.userid;
	await client.query("insert into families (family_name, family_head, family_code) values ('" + req.body.family_name + "', " + userid + ", '" + req.body.family_code + "');");
	await client.query("insert into family_members (familyid, member_id) values ((select familyid from families where family_head = " + userid + " and family_name = '" + req.body.family_name + "' and family_code = '" + req.body.family_code + "'), " + userid + ");")

	res.write("Success");

	res.end();
});

router.post('/join', async (req,res) => {

	const client = await dbcon.connect();
	var userid = req.session.userid;
	var family_name = req.body.family_name;
	var family_code = req.body.family_code;
	var results = await client.query("select familyid from families where LOWER(family_name) = LOWER('" + family_name + "') and family_code = '" + family_code + "';");

	if (typeof(results.rows[0]) != 'undefined')
	{
		var familyid = results.rows[0]['familyid'];
		await client.query("insert into family_members (familyid, member_id) values (" + familyid + ", " + userid + ");");
		res.write("Success");
	}
	else 
	{
		res.write("Failed");
	}
	
	res.end();
	
});

router.post('/leave', async (req,res) => {

	const client = await dbcon.connect();
	var userid = req.session.userid;
	var family_name = req.body.family_name;
	var family_code = req.body.family_code;
	var results = await client.query("select family_head from families where family_name = '" + family_name + "' and family_code = '" + family_code + "';");
	if (typeof(results.rows[0]) != 'undefined' && results.rows[0]['family_head'] != userid)
	{
		await client.query("delete from family_members where member_id = " + userid + " and familyid in (select familyid from families where family_name = '" + family_name + "' and family_code = '" + family_code + "');");
		res.write("Success");
	}
	else
	{
		res.write("Failed");
	}

	res.end();
	
});

router.get('/settings', async (req,res) => {
	if (req.session.loggedin == true)
	{
		res.locals.user = req.session;
		req.session.subpage = "settings";
		var userid = req.session.userid;
		req.session.results = await getFamilies(userid);

		res.render('pages/family');
	}
	else
	{
		res.redirect('/');
	}
});

router.get('/recipes', async (req,res) => {
	req.session.subpage = "recipes";
	res.locals.user = req.session;
	if (req.session.loggedin == true)
	{

		const client = await dbcon.connect();
		var userid = req.session.userid;

		var results = await client.query("select recipename, ingredients, recipe from recipes where userid in (select distinct m.member_id from family_members as m where familyid in (select distinct m1.familyid from families as f inner join family_members as m1 on m1.member_id = " + userid + "));");
		client.release();
		var recipes = results.rows;
		console.log(recipes);

		res.render('pages/family', {'recipes':recipes});
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;

async function getFamilies(userid)
{
	const client = await dbcon.connect();

	var results = await client.query("select * from families where familyid in (select familyid from family_members where member_id = " + userid + ");");
	client.release();
	return results.rows;
}
