var express= require('express');
var router = express.Router();
var session = require('express-session');
var cookie = require('cookie');
var dbcon = require("./dbConnection");


router.get('/', (req, res) => {
	res.locals.user = req.session;
	res.render('pages/index');
});
router.post('/modify/new', async (req,res) => {
	res.write("Created New Family")
});

router.get('/settings', async (req,res) => {
	res.locals.user = req.session;
	res.render('pages/settings');
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
