"use strict";
const searchDrinkBtn = document.querySelector("#search_food");
const recipeDrinkListEl = document.querySelector("#recipe_drink");
const resultsEl = document.querySelector("#results")

const getRecipeCocktails = function (event) {
    event.preventDefault();
    const alcohol = getAlcohol();
    const urlByName = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${alcohol}`
    fetch(urlByName)
        .then(res => res.json())
        .then(data => {
            // cycle through data and display drinks as cards. 
            for (let i = 0; i < data.drinks.length; i++) {
                
                
                // create Message
                const messageEl = document.createElement("article");
                messageEl.className = "message";
                // create message header element and attach to message element
                const messageHeaderEl = document.createElement("div");
                messageHeaderEl.className = "message-header";
                // create title for message element and attach to header
                const title = document.createElement("p");
                title.textContent = data.drinks[i].strDrink;
                messageHeaderEl.appendChild(title);
                messageEl.appendChild(messageHeaderEl);
                
                // Add body to card
                const messageBodyEl = document.createElement("div");
                messageBodyEl.className = "message-body columns"
                // create image
                const imageEl = document.createElement("img");
                imageEl.setAttribute("src", data.drinks[i].strDrinkThumb);
                imageEl.className = "image column";
                messageBodyEl.appendChild(imageEl);
                
                // get drink Id and store ingredients and measurements in an 2-d array
                const drinkId = data.drinks[i].idDrink
                const ingredientMeasurementList = getIngredientMeasurement(drinkId);
                console.log(ingredientMeasurementList.length);
                // for (let i = 0; i < ingredientMeasurementList[0].length; i++) {
                //     const ingredient = ingredientMeasurementList[0][i];
                //     const measurement = ingredientMeasurementList[1][i];
                    
                //     const ingredientMeasurementEl = document.createElement("p")
                //     ingredientMeasurementEl.textContent = ingredient + " - " + measurement;
                //     console.log(ingredientMeasurementEl)
                //     ingredientMeasurementEl.className = "column";
                //     messageBodyEl.appendChild(ingredientMeasurementEl);
                // }
                messageEl.appendChild(messageBodyEl);


                // append the card to html whole thing
                resultsEl.appendChild(messageEl);
            }
        })
}

const getIngredientMeasurement = function (id) {
    let ingredient = [];
    let measurement = [];
    let ingredientMeasurement = [];
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const drinkObject = data.drinks[0]
            for (const [key, value] of Object.entries(drinkObject)) {
                if (key.includes("strIngredient") && value !== null && value !== "") {
                    ingredient.push(value);
                }
            }
            for (const [key, value] of Object.entries(drinkObject)) {
                if (key.includes("strMeasure") && value !== null && value !== "") {
                    measurement.push(value)
                }
            }
            ingredientMeasurement.push(ingredient);
            ingredientMeasurement.push(measurement);
            console.log(ingredientMeasurement);
        })
            return ingredientMeasurement;
}

const getAlcohol = function () {
    const alcoholOptions = [];
    const choices = document.getElementsByClassName("alcohol");
    for (let i = 0; i < choices.length; i++) {
        if (choices[i].checked === true) {
            alcoholOptions.push(choices[i].value)
        }
    }
    const optionsStr = alcoholOptions.join(",");
    return optionsStr;
}

searchDrinkBtn.addEventListener("click", getRecipeCocktails);
