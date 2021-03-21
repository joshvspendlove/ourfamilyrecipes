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

router.post('/login', async (req,res) => {
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

			res.write('Successful');
			res.end();
		}
		else
		{
			req.session.loggedin = false;
			req.session.userid = 0;

			res.write("Failed");
			res.end();
		}
		client.release();
	}
	catch (err) {
	 console.log(err)
	}
});

router.post('/logout', (req,res) => {
	req.session.destroy();
	res.write("Logged Out");
	res.end();

});

router.post('/signup', async (req,res) => {
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

			req.session.userid = userid;
			req.session.loggedin = true;
			console.log("User Created");
			res.write('User Created');
			res.end();

		}
		else
		{
			req.session.loggedin = false;
			req.session.userid = 0;

			res.write('User Exists');
			res.end();
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
	const client = await dbcon.connect();
	var result = await client.query("SELECT * FROM users where username = '" + username + "';");

	client.release();
	return (typeof(result.rows[0]) == 'undefined');
}

module.exports = router;
