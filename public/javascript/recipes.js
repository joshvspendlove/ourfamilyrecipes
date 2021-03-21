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
	  newIngredient.innerHTML = '<input class="col-4" id="ingredient_' + nextNum + '" name="ingredient_' + nextNum + '" type="text" oninput="addNewIngredient(id);"></input><input class="col-3" type="text" id="qty_' + nextNum + '" oninput="verifyQty(id);"></input><input class="col-3" type="text" id="unit_' + nextNum + '"></input>'; //
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

function addRecipe(event)
{
	event.preventDefault();
	var ingredients = {};
  var quantites = {};
  var units = {};
	var i = 1;
	var c = i;
	var recipeName = document.getElementById('recipe_name').value;
	var directions = document.getElementById('directions').value;
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
	xhttp.send('{"recipe_name":"' + recipeName + '", "ingredients":' + JSON.stringify(ingredients) + ', "directions" : "' + directions + '"}');

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
