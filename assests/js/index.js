"use strict";
const searchFoodBtn = document.querySelector("#search_food");
const searchDrinkBtn = document.querySelector("#search_drinks");
const apiKey = "b7dd85109d944e18aa81c263b5672588";
const recipeFoodListEl = document.querySelector("#results")

const getRecipeTitleAndImage =  function (event) {
    event.preventDefault();
    const cuisine = getCuisine();
    const diet = getLifestyle();
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&cuisine=${cuisine}&diet=${diet}`
    fetch(url)
        .then(res => res.json())
        .then(async function (data) {
            console.log(data)
            for (let i = 0; i < data.results.length; i++){
                // Create article element
                const articleEl = document.createElement("article");
                articleEl.className = "message";
                // Create header Element, Content, and Append
                const headerEl = document.createElement("div"); 
                headerEl.className = "message-header";
                const recipeName = document.createElement("p");
                recipeName.textContent = data.results[i].title;
                headerEl.appendChild(recipeName);
                articleEl.appendChild(headerEl);
                // Create body Element, Content, and Append
                    // Create and display image
                const messageBodyEl = document.createElement("div");
                messageBodyEl.className = "message-body";
                const imageEl = document.createElement("div");
                imageEl.className = "level-item";
                const image = document.createElement("img");
                image.setAttribute("src", data.results[i].image);
                imageEl.appendChild(image);
                messageBodyEl.appendChild(imageEl);
                articleEl.appendChild(messageBodyEl);
                    // Create and display ingredients
                const ingredientsEl = document.createElement("div");
                const ingredientTitle = document.createElement("h2");
                ingredientTitle.classList.add("is-size-5", "is-underlined", "level-item", "mt-4", "mb-2");
                ingredientTitle.textContent = "Ingredients";
                ingredientsEl.appendChild(ingredientTitle);
                const recipeId = data.results[i].id

                const ingredients = await getIngredient(recipeId);
                console.log(ingredients.length);
                for (let i = 0; i < ingredients.length; i ++) {
                    const ingredient = document.createElement("p");
                    ingredient.className = "level-item";
                    ingredient.textContent = ingredients[i]
                    ingredientsEl.append(ingredient);
                }
                messageBodyEl.appendChild(ingredientsEl);
                    // Create and display instructions
                const instructionEl = document.createElement("div");
                const instructionTitle = document.createElement("h2");
                instructionTitle.classList.add("is-size-5", "is-underlined", "level-item", "mt-4", "mb-2");
                instructionTitle.textContent = "Instructions";
                instructionEl.appendChild(instructionTitle);
                const instructions = await getInstructions(recipeId);
                for (let i = 0; i < instructions.length; i++) {
                    const step = document.createElement("p");
                    step.classList.add("level-item", "has-text-centered")
                    step.textContent = `${i+1}. ${instructions[i]}`;
                    instructionEl.appendChild(step);
                }
                messageBodyEl.appendChild(instructionEl);




                //append article to element in HTML
                recipeFoodListEl.appendChild(articleEl);
            }
        });
}
function getCuisine () {
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
function getLifestyle () {
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



async function getInstructions (id) {
    const instructionArray = [];
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${apiKey}`);
    const data = await response.json();
    console.log(data)
    console.log(data[0].steps.length)
    for (let i = 0; i < data[0].steps.length; i++) {
        instructionArray.push(data[0].steps[i].step);
    }
    return instructionArray;
}




searchFoodBtn.addEventListener("click", getRecipeTitleAndImage)
