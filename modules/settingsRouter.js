var express= require('express');
var router = express.Router();
var session = require('express-session');
var cookie = require('cookie');
var crypto = require('crypto');

const util = require('util');
const sleep = util.promisify(setTimeout);

var dbcon = null;
try 
{
	dbcon = require("./dbLocalConnection");
} 
catch(err)
{ 
	dbcon = require("./dbConnection");
}

router.post('/account/delete', async (req,res) => {
	if (req.session.loggedin == true)
	{
		const client = await dbcon.connect();
		var userid = req.session.userid;
		client.query("delete from family_members where familyid in (select familyid from families where family_head = " + userid + ");");
		client.query("delete from families where family_head = " + userid + ";");
		client.query("delete from recipes where userid = " + userid + ";");
		client.query("delete from users where userid = " + userid + ";");
		client.release();
		req.session.destroy();
	}
	res.write("Account Deleted");
	res.end();
});


router.get('/', async (req,res) => {
	if (req.session.loggedin == true)
	{
		res.locals.user = req.session;
		res.render('pages/settings');
	}
	else
	{
		res.redirect('/');
	}
});


module.exports = router;
