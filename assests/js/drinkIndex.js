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
        .then(async function (data) {
            // cycle through data and display drinks as cards. 
            console.log(data)
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
                messageBodyEl.classList.add("message-body")
                // create image
                const imageDivEl = document.createElement("div");
                imageDivEl.classList.add("has-text-centered");
                const figureEl = document.createElement("figure");
                figureEl.classList.add("image", "is-128x128", "is-inline-block")

                const imageEl = document.createElement("img");
                imageEl.setAttribute("src", data.drinks[i].strDrinkThumb);

                figureEl.appendChild(imageEl);
                imageDivEl.appendChild(figureEl);                

                // imageEl.classList.add("image", "is-128x128", );

                messageBodyEl.appendChild(imageDivEl);
                
                // Create and Display Ingredients
                    // Title
                const ingredientsEl = document.createElement("div");
                const ingredientTitle = document.createElement("h2");
                ingredientTitle.classList.add("is-size-5", "is-underlined", "level-item", "mt-4", "mb-2");
                ingredientTitle.textContent = "Ingredients";
                ingredientsEl.appendChild(ingredientTitle);
                    // Instructions
                const drinkId = await data.drinks[i].idDrink
                const ingredientMeasurementList = await getIngredientMeasurement(drinkId);
                for (let i = 0; i < ingredientMeasurementList[0].length; i++) {
                    const ingredient = ingredientMeasurementList[0][i];
                    const measurement = ingredientMeasurementList[1][i];
                    const ingredientMeasurementEl = document.createElement("p")
                    ingredientMeasurementEl.className = "level-item";
                    ingredientMeasurementEl.textContent = ingredient + " - " + measurement;
                    console.log(ingredientMeasurementEl);
                    ingredientsEl.appendChild(ingredientMeasurementEl);
                }
                messageBodyEl.appendChild(ingredientsEl)
                // Create and Display Instructions 
                    // Title
                const instructionEl = document.createElement("div");
                const instructionTitle = document.createElement("h2");
                instructionTitle.classList.add("is-size-5", "is-underlined", "level-item", "mt-4", "mb-2");
                instructionTitle.textContent = "Instructions";
                instructionEl.appendChild(instructionTitle);
                    // Instructions
                const recipeInstructions = await getInstructions(drinkId);
                const instructions = document.createElement("p");
                // instructions.classList.add("column");
                instructions.textContent = recipeInstructions;
                instructionEl.appendChild(instructions)
                messageBodyEl.appendChild(instructionEl);
                
                // append teh messageBody to the Message
                messageEl.appendChild(messageBodyEl);

                // append the whole Message to HTML
                resultsEl.appendChild(messageEl);
            }
        })
}

async function getIngredientMeasurement (id) {
    const ingredient = [];
    const measurement = [];
    const ingredientMeasurement = [];
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    console.log(data);
    console.log(data.drinks[0].strInstructions);
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
    return ingredientMeasurement;
}

async function getInstructions (id) {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    console.log(data);
    console.log(data.drinks[0].strInstructions);
    const instructions = data.drinks[0].strInstructions;
    return instructions;
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