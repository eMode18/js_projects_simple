/**
 * @license MIT
 * @author eMode18 <ewagandi@gmail.com>
 * @copyright eMode 2024
 */
"use strict";

/** Imports */
import { getTime } from "./module.js";

const /** { Array} */ savedRecipes = Object.keys(window.localStorage).filter(
    (item) => {
      return item.startsWith("jikoni-recipe-");
    }
  );

const /** {NodeElement} */ $savedRecipeContainer = document.querySelector(
    "[data-saved-recipe-container]"
  );

$savedRecipeContainer.innerHTML = `
  <h2 class="headline-small section-title">Saved Recipes</h2>
`;

const /** {NodeElement} */ $gridList = document.createElement("div");
$gridList.classList.add("grid-list");

if (savedRecipes.length) {
  savedRecipes.map((savedRecipe, index) => {
    const {
      recipe: { image, label: title, totalTime: cookingTime, uri },
    } = JSON.parse(window.localStorage.getItem(savedRecipe));

    const /** {String} */ recipeId = uri.split("_")[1];
    const /** {Undefined || Boolean} */ isSaved = window.localStorage.getItem(
        `jikoni-recipe-${recipeId}`
      );

    const $card = document.createElement("div");
    $card.classList.add("card");
    $card.style.animationDelay = `${100 * index}ms`;

    $card.innerHTML = `
      <figure class="card-media img-holder">
        <img
          src="${image}"
          loading="lazy"
          width="195"
          height="195"
          alt="${title}"
          class="img-cover"
        />
      </figure>

      <div class="card-body">
        <h3 class="title-small">
          <a 
          href="./detail.html?recipe=${recipeId}" class="card-link">
          ${title ?? "Untitled"}
          </a>
        </h3>

        <div class="meta-wrapper">
          <div class="meta-item">
            <span
              class="material-symbols-outlined"
              aria-hidden="true"
              >schedule</span
            >
            <span class="label-medium">${
              cookingTime > 0 ? getTime(cookingTime) : "<1 minute"
            }</span>
          </div>

          <button
            class="icon-btn has-state ${isSaved ? "saved" : "removed"}"
            aria-label="Add to or remove from saved recipes" 
            onclick="saveRecipe(this, '${recipeId}')"
          >
            <span
              class="material-symbols-outlined bookmark-add"
              aria-hidden="true"
              >bookmark_add</span
            >
            <span
              class="material-symbols-outlined bookmark"
              aria-hidden="true"
              >bookmark</span
            >
          </button>
        </div>
      </div>
    `;

    $gridList.appendChild($card);
  });
} else {
  $savedRecipeContainer.innerHTML += `
    <div class="no-recipes-message" style="display: flex; justify-content: center; align-items: center; flex-direction: column; text-align: center;">
      <p class="body-large">
        Please save some recipes first 🥺
      </p>
      <p style="margin-top: 32px;">
        Start saving recipes <br>👉 <a href="recipes.html" class="btn" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: var(--primary); color: white; text-decoration: none; border-radius: 5px; transition: background-color 0.3s;">Here</a>
      </p>
    </div>
  `;
}

$savedRecipeContainer.appendChild($gridList);
