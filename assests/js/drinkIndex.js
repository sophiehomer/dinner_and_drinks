"use strict";
const searchDrinkBtn = document.querySelector("#search_drinks");
// const recipeDrinkListEl = document.querySelector("#recipe_drink");
const resultsEl = document.querySelector("#results");

// Main function
async function getRecipeCocktails (event) {
    event.preventDefault();
    removeAllChildNodes(resultsEl)
    const alcohol = document.querySelector('input[type="radio"]:checked').value;
    const urlByName = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${alcohol}`;
    const response  = await fetch(urlByName);
    const data = await response.json();
    await makeCard(data, resultsEl);
}
// Return the ingredients and measurements in a 2-d array
async function getIngredientMeasurement (id) {
    const ingredient = [];
    const measurement = [];
    const ingredientMeasurement = [];
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
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

// Return the instructions for the drink in an string
async function getInstructions (id) {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const instructions = data.drinks[0].strInstructions;
    return instructions;
}

// Save to Local Storage
const saveLocalStorage = function (event) {
    //  Get name of drink
    const message = this.parentNode.parentNode.parentNode;
    const messageTitle = message.firstChild.firstChild;
    let drinkName = messageTitle.innerText;
    drinkName = drinkName + "  ";
    // store name of drink in local storage
    const savedItems = localStorage.getItem("drink")
    if (savedItems){
        localStorage.setItem("drink", savedItems + drinkName)
    } else {
        localStorage.setItem("drink", drinkName)
    }
}

// Makes cards
async function makeCard(data, attachingEl) {
    // cycle through data and display drinks as cards. 
    for (let i = 0; i < data.drinks.length; i++) {
        // create Message
        const messageEl = document.createElement("article");
        messageEl.classList.add("message", "result-cards");
        // create message header element and attach to message element
        const messageHeaderEl = document.createElement("div");
        messageHeaderEl.classList.add("message-header");
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
        instructions.textContent = recipeInstructions;
        instructionEl.appendChild(instructions)
        messageBodyEl.appendChild(instructionEl);
        
        // append the messageBody to the Message
        messageEl.appendChild(messageBodyEl);

        // Create and append the Footer
        const footerEl = document.createElement("footer");
        footerEl.classList.add("card-footer");
        const paragraphEl = document.createElement("p");
        paragraphEl.classList.add("card-footer-item");
        const buttonEl = document.createElement("button");
        buttonEl.classList.add("button", "is-small", "favorites");
        buttonEl.textContent = "Add to Favorites ";

        buttonEl.addEventListener("click", saveLocalStorage)
        
        const iconEl = document.createElement("i");
        iconEl.classList.add("fas", "fa-star");
        buttonEl.appendChild(iconEl);
        paragraphEl.appendChild(buttonEl);
        footerEl.appendChild(paragraphEl);
        messageEl.appendChild(footerEl);
        
        // append the whole Message to HTML
        attachingEl.appendChild(messageEl);
        
    }
}

searchDrinkBtn.addEventListener("click", getRecipeCocktails);


// Helper Functions
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Nav-burger menu
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {

                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }

});