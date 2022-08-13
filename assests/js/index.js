"use strict";
const searchFoodBtn = document.querySelector("#search_food");
const apiKey = "fd7a545986234b6aaf978dd48cc2d04a";
const recipeFoodListEl = document.querySelector("#results")

// Main function 
const getRecipeTitleAndImage = async function (event) {
    event.preventDefault();
    this.classList.add("is-loading");
    removeAllChildNodes(recipeFoodListEl)
    const cuisine = getCuisine();
    const diet = getLifestyle();
    console.log(cuisine, "line 13")
    console.log(diet, "line 14")
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&cuisine=${cuisine}&diet=${diet}`
    console.log(url, "line 16")
    const response = await fetch(url);
    const data = await response.json();
    makeCard(data, recipeFoodListEl);
    this.classList.remove("is-loading");
}
// Get user's cuisine
function getCuisine() {
    const foodItems = [];
    const checkedItems = document.getElementsByClassName("cuisine");
    for (let i = 0; i < checkedItems.length; i++) {
        if (checkedItems[i].checked === true) {
            foodItems.push(checkedItems[i].value);
        }
    }
    const foodChoices = foodItems.join(",");
    return foodChoices;
}

// Get user's lifestyle
function getLifestyle() {
    let lifeStyleItems = [];
    let checkedItems = document.getElementsByClassName("lifestyle");
    for (let i = 0; i < checkedItems.length; i++) {
        if (checkedItems[i].checked === true) {
            lifeStyleItems.push(checkedItems[i].value);
        }
    }
    const lifeStyle = lifeStyleItems.join(",");
    return lifeStyle;
}

// Get dish's ingredients
async function getIngredient(id) {
    console.log(id, "line 47")
    console.log(`https://api.spoonacular.com/recipes/${id}/ingredientWidget.json?apiKey=${apiKey}`, "line 48")
    const ingredientArray = [];
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/ingredientWidget.json?apiKey=${apiKey}`);
    const data = await response.json();
    console.log(data)
    for (let i = 0; i < data.ingredients.length; i++) {
        const ingredientName = await data.ingredients[i].name;
        const measurement = await data.ingredients[i].amount.us.value + " " + data.ingredients[1].amount.us.unit;
        const ingredientMeasurement = await ingredientName + ": " + measurement;
        ingredientArray.push(ingredientMeasurement);
    }
    return ingredientArray;
}

// Get dish's instructions
async function getInstructions(id) {
    const instructionArray = [];
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${apiKey}`);
    console.log(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${apiKey}`)
    const data = await response.json();
    console.log(data, "line 65")
    for (let i = 0; i < data[0]?.steps.length; i++) {
        instructionArray.push(data[0]?.steps[i].step);
    }
    return instructionArray;
}

// Save to Local Storage
const saveLocalStorage = function (event) {
    event.preventDefault();
    //  Get name of dish
    const message = this.parentNode.parentNode.parentNode;
    const messageTitle = message.firstChild.firstChild;
    let dishName = messageTitle.innerText;
    dishName = dishName + "  ";
    // store name of drink in local storage
    const savedItems = localStorage.getItem("dish")
    if (savedItems) {
        localStorage.setItem("dish", savedItems + dishName)
    } else {
        localStorage.setItem("dish", dishName)
    }
}

// Make cards for each dish
async function makeCard(data, attachingEl) {
    console.log(data, "line 94")
    if (data.results.length === 0 ) {
        console.log("line 99")
        // Create article element
        const articleEl = document.createElement("article");
        articleEl.classList.add("message", "result-cards");
        // Create header Element, Content, and Append
        const headerEl = document.createElement("div");
        headerEl.classList.add("message-header", "is-uppercase");
        const recipeName = document.createElement("p");
        recipeName.textContent = "No recipes found"
        headerEl.appendChild(recipeName);
        articleEl.appendChild(headerEl);
        const messageBodyEl = document.createElement("div");
        messageBodyEl.className = "message-body";
        articleEl.appendChild(messageBodyEl);
        const warning = document.createElement("p");
        warning.textContent = "Sorry, no recipes were found."
        messageBodyEl.appendChild(warning);

        //append article to element in HTML
        attachingEl.appendChild(articleEl);
    }

    for (let i = 0; i < data.results.length; i++) {
        // Create article element
        const articleEl = document.createElement("article");
        articleEl.classList.add("message", "result-cards");
        // Create header Element, Content, and Append
        const headerEl = document.createElement("div");
        headerEl.classList.add("message-header", "is-uppercase");
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
        ingredientTitle.classList.add("is-uppercase", "level-left", "mt-4", "mb-2", "ingredientTitle");
        ingredientTitle.textContent = "Ingredients";
        ingredientsEl.appendChild(ingredientTitle);
        const recipeId = data.results[i].id

        const ingredients = await getIngredient(recipeId);
        console.log(ingredients.length);
        for (let i = 0; i < ingredients.length; i++) {
            const ingredient = document.createElement("p");
            ingredient.className = "level-left";
            ingredient.textContent = ingredients[i]
            ingredientsEl.append(ingredient);
        }
        messageBodyEl.appendChild(ingredientsEl);
        // Create and display instructions
        const instructionEl = document.createElement("div");
        const instructionTitle = document.createElement("h2");
        instructionTitle.classList.add("is-uppercase", "level-left", "mt-4", "mb-2", "instructionTitle");
        instructionTitle.textContent = "Instructions";
        instructionEl.appendChild(instructionTitle);
        const instructions = await getInstructions(recipeId);
        for (let i = 0; i < instructions.length; i++) {
            const step = document.createElement("p");
            step.classList.add("level-left")
            step.textContent = `${i + 1}. ${instructions[i]}`;
            instructionEl.appendChild(step);
        }
        messageBodyEl.appendChild(instructionEl);

        // Create and append the Footer
        const footerEl = document.createElement("footer");
        footerEl.classList.add("card-footer");
        const paragraphEl = document.createElement("p");
        paragraphEl.classList.add("card-footer-item");
        const buttonEl = document.createElement("button");
        buttonEl.classList.add("button", "favorites");
        buttonEl.textContent = "ADD TO FAVORITES";

        buttonEl.addEventListener("click", saveLocalStorage)

        const iconEl = document.createElement("i");
        buttonEl.appendChild(iconEl);
        paragraphEl.appendChild(buttonEl);
        footerEl.appendChild(paragraphEl);
        articleEl.appendChild(footerEl);

        //append article to element in HTML
        attachingEl.appendChild(articleEl);
    }
}

searchFoodBtn.addEventListener("click", getRecipeTitleAndImage)

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