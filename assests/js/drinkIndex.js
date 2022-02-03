"use strict";
const searchDrinkBtn = document.querySelector("#search_food")
const recipeDrinkListEl = document.querySelector("#recipe_drink")

const getRecipeCocktails = function (event) {
    event.preventDefault();
    const alcohol = getAlcohol();
    const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${alcohol}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < data.drinks.length; i++) {
                // create article, message-header, and append title
                const articleEl = document.createElement("article");
                articleEl.className = "message";
                const headerEl = document.createElement("div");
                articleEl.appendChild(headerEl);
                headerEl.className = "message-header";
                const title = document.createElement("p");
                title.textContent = data.drinks[i].strDrink;
                // append title
                headerEl.appendChild(title);
                // create message body. and place image
                const messageBody = document.createElement("div");
                messageBody.className="message-body";
                const imgEl = document.createElement("img")
                imgEl.className = "image"
                imgEl.setAttribute("src", data.drinks[i].strDrinkThumb);
                messageBody.appendChild(imgEl);



                recipeDrinkListEl.appendChild(title);
                recipeDrinkListEl.appendChild(imgEl);
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
