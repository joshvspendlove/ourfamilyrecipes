document.getElementById("saveRecipe").addEventListener('submit', addRecipe, false);
document.getElementById("saveRecipe").addEventListener('submit', addRecipe, false);

function addNewIngredient(id)
{
  var ingredients = document.getElementById('ingredientList');
  var nextNum = parseInt(id.substring(11)) + 1;
  var currNum = parseInt(id.substring(11));

  if (document.getElementById('ingredient_' + nextNum) == null)
  {
	  var newIngredient = document.createElement("li")
	  newIngredient.setAttribute('class', 'row');
	  newIngredient.innerHTML = '<input class="col-4" id="ingredient_' + nextNum + '" name="ingredient_' + nextNum + '" type="text" oninput="addNewIngredient(id);"></input><input class="col-3" type="text" id="qty_' + nextNum + '" oninput="verifyQty(id);"></input><input class="col-4" type="text" id="unit_' + nextNum + '"></input>'; //
    ingredients.appendChild(newIngredient);

  }
  
  if (document.getElementById(id).value.trim() == "" && (document.getElementById('ingredient_' + nextNum).parentNode == ingredients.lastChild && !document.getElementById('ingredient_' + nextNum).value.trim()))
  {
	  ingredients.removeChild(document.getElementById('ingredient_' + nextNum).parentNode);
  }
  if (document.getElementById(id).value.trim() != "")
  {
    document.getElementById("qty_" + currNum).required = true;
    document.getElementById("unit_" + currNum).required = true;
  }
}

function addNewIngredientUpdate(id)
{
  var ingredients = document.getElementById('ingredientListUpdate');
  var nextNum = parseInt(id.substring(11)) + 1;
  var currNum = parseInt(id.substring(11));

  if (document.getElementById('ingredient_' + nextNum) == null)
  {
	  var newIngredient = document.createElement("li");
	  newIngredient.setAttribute('class', 'row');
	  newIngredient.innerHTML = '<input class="col-4" id="ingredient_' + nextNum + '" name="ingredient_' + nextNum + '" type="text" oninput="addNewIngredientUpdate(id);"></input><input class="col-3" type="text" id="qty_' + nextNum + '" oninput="verifyQty(id);"></input><input class="col-4" type="text" id="unit_' + nextNum + '"></input>';
	ingredients.appendChild(newIngredient);

  }

  if (document.getElementById(id).value.trim() == "" && (document.getElementById('ingredient_' + nextNum).parentNode == ingredients.lastChild && !document.getElementById('ingredient_' + nextNum).value.trim()))
  {
	  ingredients.removeChild(document.getElementById('ingredient_' + nextNum).parentNode);
  }
  if (document.getElementById(id).value.trim() != "")
  {
    document.getElementById("qty_" + currNum).required = true;
    document.getElementById("unit_" + currNum).required = true;
  }
}

function deleteRecipe(id)
{
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
				window.location.reload();
		}
	};
	xhttp.open("POST", "/recipes/delete", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send('{"recipeid":' + id + '}');
}

function updateRecipe(id)
{
	
	var directions = {};
	var ingredients = {};
  	var quantites = {};
  	var units = {};
	var i = 1;
	var c = i;
	var recipeName = document.getElementById(id + '_recipe_name').value;
	
	
	while (document.getElementById(id + '_direction_' + c) != null && document.getElementById(id +'_direction_' + i) != null)
	{

		if (document.getElementById(id +'_direction_' + i).value.trim() != "")
		{
			directions[c] = {};
    		directions[c]['step'] = document.getElementById(id + '_direction_' + i).value;
  
			i += 1;
			c += 1;
		}
		else
		{
			i += 1;
		}
	}
	
	i = 1;
	c = i;
	
	while ((document.getElementById(id + '_ingredient_' + c) != null && document.getElementById(id + '_ingredient_' + i) != null) && (document.getElementById(id + '_qty_' + c) != null &&  document.getElementById(id + '_qty_' + c) != null) &&  (document.getElementById(id + '_unit_' + c) != null &&  document.getElementById(id + '_unit_' + c) != null))
	{

		if (document.getElementById(id + '_ingredient_' + c).value.trim() != "")
		{
			ingredients[c] = {}
      		ingredients[c]['name'] = document.getElementById(id + '_ingredient_' + i).value;
      		ingredients[c]['qty'] = document.getElementById(id + '_qty_' + c).value.match(/\d+([\/ ]\d+)?/g);
      	  	ingredients[c]['unit'] = document.getElementById(id + '_unit_' + c).value;
			i += 1;
			c += 1;
		}
		else
		{
			i += 1;
		}
	}
;
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
				window.location.reload();
		}
	};
	xhttp.open("POST", "/recipes/update", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send('{"recipeid":' + id + ', "recipe_name":"' + recipeName + '", "ingredients":' + JSON.stringify(ingredients) + ', "directions" : ' + JSON.stringify(directions) + '}');
	
	
}

function addNewDirection(id)
{
  var directions = document.getElementById('directionList');
  var nextNum = parseInt(id.substring(10)) + 1;
  var currNum = parseInt(id.substring(10));

  if (document.getElementById('direction_' + nextNum) == null)
  {
	  var newDirection = document.createElement("li")
	  newDirection.innerHTML = '<input class="col" id="direction_' + nextNum + '" name="direction_' + nextNum + '" type="text" oninput="addNewDirection(id);"></input>'; 
    directions.appendChild(newDirection);

  }

  if (document.getElementById(id).value.trim() == "" && (document.getElementById('direction_' + nextNum).parentNode == directions.lastChild && !document.getElementById('direction_' + nextNum).value.trim()))
  {
	  directions.removeChild(document.getElementById('direction_' + nextNum).parentNode);
  }
}

function addNewDirectionUpdate(id)
{
	var recipeid = Number(id.substring(0,id.indexOf('_')));
	
	var directions = document.getElementById('directionListUpdate');
  
  var currNum = Number(id.substring(id.lastIndexOf('_') + 1));
  var nextNum = currNum + 1;

  if (document.getElementById(recipeid + '_direction_' + nextNum) == null)
  {
	  var newDirection = document.createElement("li")
	  newDirection.innerHTML = '<input class="col" id="' + recipeid + '_direction_' + nextNum + '" name="direction_' + nextNum + '" type="text" oninput="addNewDirectionUpdate(id);"></input>'; 
	  directions.appendChild(newDirection);

  }

  if (document.getElementById(id).value.trim() == "" && (document.getElementById(recipeid + '_direction_' + nextNum).parentNode == directions.lastChild && !document.getElementById('direction_' + nextNum).value.trim()))
  {
	  directions.removeChild(document.getElementById(recipeid + '_direction_' + nextNum).parentNode);
  }
}

function addRecipe(event)
{
	event.preventDefault();
	var directions = {};
	var ingredients = {};
  	var quantites = {};
  	var units = {};
	var i = 1;
	var c = i;
	var recipeName = document.getElementById('recipe_name').value;
	
	
	while (document.getElementById('direction_' + c) != null && document.getElementById('direction_' + i) != null)
	{

		if (document.getElementById('direction_' + i).value.trim() != "")
		{
			directions[c] = {}
    		directions[c]['step'] = document.getElementById('direction_' + i).value;
  
			i += 1;
			c += 1;
		}
		else
		{
			i += 1;
		}
	}
	
	i = 1;
	c = i;
	
	while ((document.getElementById('ingredient_' + c) != null && document.getElementById('ingredient_' + i) != null) && (document.getElementById('qty_' + c) != null &&  document.getElementById('qty_' + i) != null) &&  (document.getElementById('unit_' + c) != null &&  document.getElementById('unit_' + i) != null))
	{

		if (document.getElementById('ingredient_' + i).value.trim() != "")
		{
			ingredients[c] = {}
      		ingredients[c]['name'] = document.getElementById('ingredient_' + i).value;
      		ingredients[c]['qty'] = document.getElementById('qty_' + i).value.match(/\d+([\/ ]\d+)?/g);
      	  	ingredients[c]['unit'] = document.getElementById('unit_' + i).value;
			i += 1;
			c += 1;
		}
		else
		{
			i += 1;
		}
	}

	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
				window.location.reload();
		}
	};
	xhttp.open("POST", "/recipes/add", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send('{"recipe_name":"' + recipeName + '", "ingredients":' + JSON.stringify(ingredients) + ', "directions" : ' + JSON.stringify(directions) + '}');

}

function verifyQty(id)
{
	var qty = document.getElementById(id).value;
	if (qty.match(/[^0-9\/.,\- ]/g))
	{
		qty.match(/[^0-9\/.,\- ]/g).forEach(letter => {
			console.log(letter);
			qty = qty.replace(letter, "");
		});
	}
	document.getElementById(id).value = qty;
}


function addRow()
{
/*	if (event.keyCode == 13)
	{
		var actElm = document.activeElement;
		var id = actElm.getAttribute('id');
		if (id.includes('direction'))
		{
			var recipeid = Number(id.substring(0,id.indexOf('_')));
			var currNum = Number(id.substring(id.lastIndexOf('_') + 1));
			var nextNum = currNum + 1;
			var nextDirection = "";
			var lastDirection = "";
			var carryDirection = "";
			
			
			
			while(document.getElementById(recipeid + '_direction_' + nextNum) != null)
			{
				console.log(document.getElementById(recipeid + '_direction_' + nextNum) != null);
				nextDirection = document.getElementById(recipeid + '_direction_' + nextNum).value;
				if (carryDirection != "")
					nextDirection = carryDirection;
				document.getElementById(recipeid + '_direction_' + nextNum).value = "";
				
				if (document.getElementById(recipeid + '_direction_' + (nextNum + 1)) != null)
				{
					lastDirection = document.getElementById(recipeid + '_direction_' + (nextNum + 1)).value;
					document.getElementById(recipeid + '_direction_' + (nextNum + 1)).value = nextDirection;
					nextNum++;
					carryDirection = lastDirection;
				}
				else
				{
					document.getElementById(recipeid + '_direction_' + (nextNum)).value = nextDirection;
					var newRow = document.createElement('li');
					newRow.innerHTML = '<input class="col" id="' + recipeid + '_direction_' + (nextNum + 1) + '" type="text" oninput="addNewDirectionUpdate(id);" required></input>'
					actElm.parentNode.parentNode.appendChild(newRow);
					break;
				}
				nextNum++;
			}
			
		}
	}
	*/
	return event.keyCode != 13;
}