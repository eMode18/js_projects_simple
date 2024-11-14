/**
 * @license MIT
 * @author eMode18 <ewagandi@gmail.com>
 * @copyright eMode 2024
 */

"use strict";

/**
 * Imports
 */

import { fetchData } from "./api.js";
import { getTime } from "./module.js";

/**
 * Render data
 */

const /** {NodeElement} */ $detailContainer = document.querySelector(
    "[data-detail-container]"
  );

// Get recipe ID from URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("recipe");

// Temporarily modify the access point to get a specific recipe
const originalAccessPoint = window.ACCESS_POINT;
window.ACCESS_POINT = `${originalAccessPoint}/${recipeId}`;

fetchData([], (data) => {
  // Restore the original access point
  window.ACCESS_POINT = originalAccessPoint;

  if (!data || !data.recipe) {
    console.error("Recipe not found");
    console.log("API Response:", data); // Debug log
    return;
  }

  const {
    images: { LARGE, REGULAR, SMALL, THUMBNAIL },
    label: title,
    source: author,
    ingredients = [],
    totalTime: cookingTime = 0,
    calories = 0,
    cuisineType = [],
    dietLabels = [],
    dishType = [],
    yield: servings = 0,
    ingredientLines = [],
    uri,
  } = data.recipe;

  document.title = `${title} - Jikoni Kenya`;

  const /** {Object} */ banner = LARGE ?? REGULAR ?? SMALL ?? THUMBNAIL;
  const { url: bannerUrl, width, height } = banner;

  const /** {Array} */ tags = [...cuisineType, ...dietLabels, ...dishType];

  let /** {String} */ tagElements = "";
  let /** {String} */ ingredientItems = "";

  const /** {String} */ recipeId = uri.split("_")[1];
  const /** {Undefined || Boolean} */ isSaved = window.localStorage.getItem(
      `jikoni-recipe-${recipeId}`
    );

  tags.map((tag) => {
    let /** {String} */ type = "";

    if (cuisineType.includes(tag)) type = "cuisineType";
    else if (dietLabels.includes(tag)) type = "diet";
    else if (dishType.includes(tag)) type = "dishType";

    tagElements += `
      <a
        href="./recipes.html?${type}=${tag.toLowerCase()}"
        class="filter-chip label-large has-state"
      >
        ${tag}
      </a>
    `;
  });

  ingredientLines.map((ingredient) => {
    ingredientItems += `
      <li class="ingr-item">
        ${ingredient}
      </li>
    `;
  });

  $detailContainer.innerHTML = `
      <figure class="detail-banner img-holder" >
        <img
          src="${bannerUrl}"
          width="${width}"
          height="${height}"
          alt="${title}"
          class="img-cover"
          style="object-fit: cover; width: 100%; height: 100%;"
        />
      </figure>

      <div class="detail-content">
        <div class="title-wrapper">
          <h1 class="display-small">${title ?? "Untitled"}</h1>

          <button class="btn btn-secondary has-state has-icon ${
            isSaved ? "saved" : "removed"
          }" data-save-btn>
            <span class="material-symbols-outlined bookmark-add" aria-hidden="true">
              bookmark_add
            </span>

            <span class="material-symbols-outlined bookmark" aria-hidden="true">
              bookmark
            </span>

            <span class="label-large btn-text">${
              isSaved ? "Remove" : "Save"
            }</span>
          </button>
        </div>

        <div class="detail-author label-large">
          <span class="span">by </span>${author ?? "Unknown"}
        </div>

        <div class="detail-stats">
          <div class="stats-item">
            <span class="display-medium">${ingredients.length}</span>

            <span class="label-medium"> Ingredients </span>
          </div>

          <div class="stats-item">


            <span class="display-small">${
              cookingTime > 0 ? getTime(cookingTime) : "< 1 minute"
            }</span>

             <span class="label-medium">cooking time</span>
          </div>

          <div class="stats-item">
            <span class="display-medium">${Math.floor(calories)} </span>

            <span class="label-medium"> Calories </span>
          </div>
        </div>

        ${tagElements ? `<div class="tag-list">${tagElements}</div>` : ""}

        <h2 class="title-medium ingr-title">
          Ingredients
          <span class="label-medium"> for ${servings} servings </span>
        </h2>

        ${
          ingredientItems
            ? `<ul class="body-large ingr-list">${ingredientItems}</ul>`
            : ""
        }
      </div>
  `;

  // Add event listener after the content is rendered
  const saveBtn = $detailContainer.querySelector("[data-save-btn]");
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      const isSaved = window.localStorage.getItem(`jikoni-recipe-${recipeId}`);

      saveRecipe(saveBtn, recipeId, title);

      if (isSaved) {
        window.localStorage.removeItem(`jikoni-recipe-${recipeId}`);
        this.classList.remove("saved");
        this.classList.add("removed");
        this.querySelector(".btn-text").textContent = "Save";
      } else {
        window.localStorage.setItem(`jikoni-recipe-${recipeId}`, title);
        this.classList.remove("removed");
        this.classList.add("saved");
        this.querySelector(".btn-text").textContent = "Remove";
      }
    });
  }
});
