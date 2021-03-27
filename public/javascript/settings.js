function deleteAccount()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			location.reload();
		}
	};
	xhttp.open("POST", "/settings/account/delete", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send('{"delete":"true"}');
}