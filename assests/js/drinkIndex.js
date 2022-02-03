"use strict";
const searchDrinkBtn = document.querySelector("#search_food");
const recipeDrinkListEl = document.querySelector("#recipe_drink");
const resultsEl = document.querySelector("#results")

const getRecipeCocktails = function (event) {
    event.preventDefault();
    const alcohol = getAlcohol();
    const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${alcohol}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < data.drinks.length; i++) {
                // create message
                const messageEl = document.createElement("article");
                messageEl.className = "message";
                // create message header element and attach to message element
                const messageHeaderEl = document.createElement("div");
                messageHeaderEl.className ="message-header";
                // create title for message element and attach to header
                const title = document.createElement("p");
                title.textContent = data.drinks[i].strDrink;
                messageHeaderEl.appendChild(title);
                messageEl.appendChild(messageHeaderEl);
                
                // Add body to card
                const messageBodyEl = document.createElement("div");
                messageBodyEl.className = "message-body"
                // create image
                const imageEl = document.createElement("img");
                imageEl.setAttribute("src", data.drinks[i].strDrinkThumb);
                imageEl.className = "image"; 
                messageBodyEl.appendChild(imageEl);
                messageEl.appendChild(messageBodyEl);
                
                // append the whole thing
                resultsEl.appendChild(messageEl);
            }
        })
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
