"use strict";
const favoritesDrinksEL = document.querySelector("#favorite_drinks");
const favoriteFoodEl = document.querySelector("#favorite_food");
const apiKey = "27d1894e53484dba81f24497d28622f4";

const loadLocalStorageDrink = async function () {
    // saves the string so drink names
    let localStorageLoad = localStorage.getItem("drink");
    // splits the string into an array
    localStorageLoad = localStorageLoad.split("  ");
    // cycles through the array and gets the drink info
    console.log(localStorageLoad.length)
    if (localStorageLoad.length === 0) {
        return;
    } else {
        for (let i = 0; i < localStorageLoad.length; i++){
            console.log(localStorageLoad[i])
            let drinkName = localStorageLoad[i];
            if (drinkName === "" || drinkName === "  ") {
                continue;
            } else {
                const drinkInfo = await getDrinkInfo(drinkName);
                console.log(drinkInfo)
                makeCardDrink(drinkInfo, favoritesDrinksEL);
            }
        }
    }
}

const getDrinkInfo = async function (drinkName) {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}
    `);
    const data = await response.json();
    console.log(data)
    return data
}

loadLocalStorageDrink();

// Make Cards
async function makeCardDrink(data, attachingEl) {
    // cycle through data and display drinks as cards. 
    for (let i = 0; i < data.drinks.length; i++) {
        // create Message
        const messageEl = document.createElement("article");
        messageEl.className = "message";
        // create message header element and attach to message element
        const messageHeaderEl = document.createElement("div");
        messageHeaderEl.classList.add("message-header", "is-uppercase");
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
        figureEl.classList.add("image", "is-128x128", "level-left")
        const imageEl = document.createElement("img");
        imageEl.setAttribute("src", data.drinks[i].strDrinkThumb);
        figureEl.appendChild(imageEl);
        imageDivEl.appendChild(figureEl);                
        messageBodyEl.appendChild(imageDivEl);
        // Create and Display Ingredients
            // Title
        const ingredientsEl = document.createElement("div");
        const ingredientTitle = document.createElement("h2");
        ingredientTitle.classList.add("is-size-6", "is-underlined", "is-uppercase", "level-left", "mt-4", "mb-2");
        ingredientTitle.textContent = "Ingredients";
        ingredientsEl.appendChild(ingredientTitle);
            // Instructions
        const drinkId = await data.drinks[i].idDrink
        const ingredientMeasurementList = await getIngredientMeasurementDrink(drinkId);
        for (let i = 0; i < ingredientMeasurementList[0].length; i++) {
            const ingredient = ingredientMeasurementList[0][i];
            const measurement = ingredientMeasurementList[1][i];
            const ingredientMeasurementEl = document.createElement("p")
            ingredientMeasurementEl.className = "level-left";
            ingredientMeasurementEl.textContent = ingredient + " - " + measurement;
            ingredientsEl.appendChild(ingredientMeasurementEl);
        }
        messageBodyEl.appendChild(ingredientsEl)
        // Create and Display Instructions 
            // Title
        const instructionEl = document.createElement("div");
        const instructionTitle = document.createElement("h2");
        instructionTitle.classList.add("is-size-6", "is-underlined", "is-uppercase", "level-left", "mt-2", "mb-2");
        instructionTitle.textContent = "Instructions";
        instructionEl.appendChild(instructionTitle);
            // Instructions
        const recipeInstructions = await getInstructionsDrink(drinkId);
        const instructions = document.createElement("p");
        instructions.textContent = recipeInstructions;
        instructionEl.appendChild(instructions)
        messageBodyEl.appendChild(instructionEl);
        
        // append the messageBody to the Message
        messageEl.appendChild(messageBodyEl);

        // // Create and append the Footer
        const footerEl = document.createElement("footer");
        footerEl.classList.add("card-footer");
        const paragraphEl = document.createElement("p");
        paragraphEl.classList.add("card-footer-item");
        const buttonEl = document.createElement("button");
        buttonEl.classList.add("button", "removeButton");
        buttonEl.textContent = "REMOVE";

        buttonEl.addEventListener("click", deleteLocalStorageDrink)
        
        const iconEl = document.createElement("i");
  
        buttonEl.appendChild(iconEl);
        paragraphEl.appendChild(buttonEl);
        footerEl.appendChild(paragraphEl);
        messageEl.appendChild(footerEl);
        
        // append the whole Message to HTML
        attachingEl.appendChild(messageEl);
        
    }
}

function deleteLocalStorageDrink () {
        //  Get name of drink
        const message = this.parentNode.parentNode.parentNode;
        const messageTitle = message.firstChild.firstChild;
        const drinkName = messageTitle.innerText;
        const savedDrink = localStorage.getItem("drink");
        console.log(savedDrink)
        console.log(drinkName)
        const updatedDrinks = savedDrink.replace(drinkName, "");
        console.log(updatedDrinks)
        localStorage.setItem("drink", updatedDrinks);
        message.remove();
}

// Get ingredients and measurements
async function getIngredientMeasurementDrink (id) {
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
// Get instructions
async function getInstructionsDrink (id) {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const instructions = data.drinks[0].strInstructions;
    return instructions;
}


// /////////////////////////////// FOOD LOADING //////////////////////////////////////////////////////////
const loadLocalStorageFood = async function () {
    // saves the string so drink names
    let localStorageLoad = localStorage.getItem("dish");
    // splits the string into an array
    localStorageLoad = localStorageLoad.split("  ");
    // cycles through the array and gets the drink info
    console.log(localStorageLoad.length)
    if (localStorageLoad.length === 0) {
        return;
    } else {
        for (let i = 0; i < localStorageLoad.length; i++){
            console.log(localStorageLoad[i])
            let dishName = localStorageLoad[i];
            if (dishName === "" || dishName === "  ") {
                continue;
            } else {
                const dishInfo = await getDishInfo(dishName);
                console.log(dishInfo)
                await makeCardFood(dishInfo, favoriteFoodEl);
            }
        }
    }
}

// Make cards for each dish
async function makeCardFood (data, attachingEl) {
    for (let i = 0; i < data.results.length; i++){
        // Create article element
        const articleEl = document.createElement("article");
        articleEl.className = "message", "result-cards";
        // Create header Element, Content, and Append
        const headerEl = document.createElement("div"); 
        headerEl.classList.add("message-header",  "is-uppercase");
        const recipeName = document.createElement("p");
        recipeName.textContent = data.results[i].title;
        headerEl.appendChild(recipeName);
        articleEl.appendChild(headerEl);
        // Create body Element, Content, and Append
            // Create and display image
        const messageBodyEl = document.createElement("div");
        messageBodyEl.className = "message-body";
        const imageEl = document.createElement("div");
        imageEl.className = "level-left";
        const image = document.createElement("img");
        image.setAttribute("src", data.results[i].image);
        imageEl.appendChild(image);
        messageBodyEl.appendChild(imageEl);
        articleEl.appendChild(messageBodyEl);
            // Create and display ingredients
        const ingredientsEl = document.createElement("div");
        const ingredientTitle = document.createElement("h2");
        ingredientTitle.classList.add("is-size-6", "is-underlined", "is-uppercase", "level-left", "mt-2", "mb-2");
        ingredientTitle.textContent = "Ingredients";
        ingredientsEl.appendChild(ingredientTitle);
        const recipeId = data.results[i].id

        const ingredients = await getIngredient(recipeId);
        console.log(ingredients.length);
        for (let i = 0; i < ingredients.length; i ++) {
            const ingredient = document.createElement("p");
            ingredient.className = "level-left";
            ingredient.textContent = ingredients[i]
            ingredientsEl.append(ingredient);
        }
        messageBodyEl.appendChild(ingredientsEl);
            // Create and display instructions
        const instructionEl = document.createElement("div");
        const instructionTitle = document.createElement("h2");
        instructionTitle.classList.add("is-size-6", "is-underlined", "is-uppercase", "level-left", "mt-2", "mb-2");
        instructionTitle.textContent = "Instructions";
        instructionEl.appendChild(instructionTitle);
        const instructions = await getInstructions(recipeId);
        for (let i = 0; i < instructions.length; i++) {
            const step = document.createElement("p");
            step.classList.add("level-left")
            step.textContent = `${i+1}. ${instructions[i]}`;
            instructionEl.appendChild(step);
        }
        messageBodyEl.appendChild(instructionEl);


        // // Create and append the Footer
        const footerEl = document.createElement("footer");
        footerEl.classList.add("card-footer");
        const paragraphEl = document.createElement("p");
        paragraphEl.classList.add("card-footer-item");
        const buttonEl = document.createElement("button");

        buttonEl.classList.add("button", "removeButton");
        buttonEl.textContent = "REMOVE";

        buttonEl.addEventListener("click", deleteLocalStorageFood)
        
        const iconEl = document.createElement("i");
        // iconEl.classList.add("fa", "fa-trash");
        buttonEl.appendChild(iconEl);
        paragraphEl.appendChild(buttonEl);
        footerEl.appendChild(paragraphEl);
        articleEl.appendChild(footerEl);

        //append article to element in HTML
        attachingEl.appendChild(articleEl);
    }
}
// Get the saved dish data
const getDishInfo = async function (drinkName) {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?titleMatch=${drinkName}&apiKey=${apiKey}&number=1`);
    const data = await response.json();
    console.log(data)
    return data
}
async function getIngredient (id) {
    const ingredientArray = [];
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/ingredientWidget.json?apiKey=${apiKey}`);
    const data = await response.json();
    console.log(data)
    for (let i = 0; i < data.ingredients.length; i++){
        const ingredientName = await data.ingredients[i].name;
        const measurement = await data.ingredients[i].amount.us.value + " " + data.ingredients[1].amount.us.unit;
        const ingredientMeasurement = await ingredientName + ": " + measurement;
        ingredientArray.push(ingredientMeasurement);
    }
    return ingredientArray;
}

// Get instructions
async function getInstructions (id) {
    const instructionArray = [];
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${apiKey}`);
    const data = await response.json();
    for (let i = 0; i < data[0].steps.length; i++) {
        instructionArray.push(data[0].steps[i].step);
    }
    return instructionArray;
}

// Delete Food local storage
function deleteLocalStorageFood () {
    //  Get name of drink
    const message = this.parentNode.parentNode.parentNode;
    const messageTitle = message.firstChild.firstChild;
    const dishName = messageTitle.innerText;
    const savedDishes = localStorage.getItem("dish");
    console.log(savedDishes)
    console.log(dishName)
    const updatedDishes = savedDishes.replace(dishName, "");
    console.log(updatedDishes)
    localStorage.setItem("dish", updatedDishes);
    message.remove();
}
loadLocalStorageFood();

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