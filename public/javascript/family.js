document.getElementById("createFamily").addEventListener('submit', createFamily, false);
document.getElementById("joinFamily").addEventListener('submit', joinFamily, false);

function createFamily(event)
{
  event.preventDefault();
  var family_name = document.getElementById("family_name-c").value;
  var family_code = document.getElementById("family_code-c").value;
  var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
				if (this.responseText == "Success")
					location.reload();
				else
				{
					showAlert('Error Creating Family');
				}
		}
	};
	xhttp.open("POST", "/family/modify/new", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send('{"family_name":"' + family_name + '", "family_code":"' + family_code + '"}');

}

function joinFamily(event)
{
  event.preventDefault();
  var family_name = document.getElementById("family_name-j").value;
  var family_code = document.getElementById("family_code-j").value;
  var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
				if (this.responseText == "Success")
					location.reload();
				else
				{
					showAlert('Unable to Join Family');
				}
		}
	};
	xhttp.open("POST", "/family/join", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send('{"family_name":"' + family_name + '", "family_code":"' + family_code + '"}');

}

function leaveFamily(family_name,family_code)
{
 
  var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
				if (this.responseText == "Success")
					location.reload();
				else
				{
					showAlert("Unable to Leave Family");
				}
		}
	};
	xhttp.open("POST", "/family/leave", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send('{"family_name":"' + family_name + '", "family_code":"' + family_code + '"}');

}

function showAlert(message)
{
	if (document.getElementById('errorAlert') == null)
	{
		var errorAlert = document.createElement('div');
		errorAlert.setAttribute('class', 'alert alert-danger fixed-top alert-dismissible');
		errorAlert.setAttribute('role', 'alert');
		errorAlert.setAttribute('id', 'errorAlert');
		errorAlert.innerHTML = '<button type="button" class="close" data-dismiss="alert">×</button>' + message;
		document.body.appendChild(errorAlert);
	}
	else
		document.getElementById('errorAlert').innerHTML = message;
	
}