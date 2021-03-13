function displayMessage(message)
{
	document.getElementById('message').style.display='block';
	document.getElementById('message').innerHTML = message;
	
	if (message.includes("Success"))
	{
		document.getElementById('message').style.background = "lightgreen";
	}
	else
	{
		document.getElementById('message').style.background = "red";
	}
	setTimeout(function() {document.getElementById('message').className = "message fadeout"}, 1000);
	setTimeout(function() {document.getElementById('message').className = "message"; document.getElementById('message').style.display='none'; if (buttons_pressed >= 4){window.location.reload();}},3250);
}