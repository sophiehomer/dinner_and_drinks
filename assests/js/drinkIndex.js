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
                const listEl = document.createElement("p");
                listEl.textContent = data.drinks[i].strDrink;
                const imgEl = document.createElement("img")
                imgEl.setAttribute("src", data.drinks[i].strDrinkThumb)
                recipeDrinkListEl.appendChild(listEl);
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
