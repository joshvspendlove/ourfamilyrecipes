if (document.getElementById("login") != null)
	document.getElementById("login").addEventListener('submit', login, false);
if (document.getElementById("logout") != null)
	document.getElementById("logout").addEventListener('submit', logout, false);
	if (document.getElementById("signup") != null)
		document.getElementById("signup").addEventListener('submit', signup, false);

function login(event)
{
	event.preventDefault();
	var xhttp = new XMLHttpRequest();
  var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			if (this.responseText.includes("Successful"))
			{
				window.location.reload();
			}
			else
			{
				document.getElementById('message').innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">incorrect Username or Password  <button type="button" class="close" data-dismiss="alert" aria-label="Close">    <span aria-hidden="true">&times;</span>  </button></div>'
			}
		}
	};
	xhttp.open("POST", "/user/auth/login", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send('{"username":"' + username + '", "password":"' + password + '"}');
}

function logout(event)
{
	event.preventDefault();
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			window.location.reload();
		}
	};
	xhttp.open("POST", "/user/auth/logout", true);
	xhttp.send();
}

function signup(event)
{
	event.preventDefault();

	var username = document.getElementById('signup_username').value;
	var password = document.getElementById('signup_password').value;

	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			if (this.responseText.includes("Created"))
			{
				window.location.reload();
			}
			else
			{
					document.getElementById('signupMessage').innerHTML = "<h6 class='text-center text-danger'>" + this.responseText + "</h6><hr>";
			}
		}
	};
	xhttp.open("POST", "/user/auth/signup", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send('{"username":"' + username + '", "password":"' + password + '"}');
}
