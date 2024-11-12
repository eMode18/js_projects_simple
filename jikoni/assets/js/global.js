/**
 * @license MIT
 * @author eMode18 <ewagandi@gmail.com>
 * @copyright eMode 2024
 */

"use strict";

import { fetchData } from "./api.js";

/**
 * Add event on several elements
 * @param {NodeList} $elements NodeList
 * @param {String} eventType Event type string
 * @param {Function} callback callback function
 */

window.addEventOnElements = ($elements, eventType, callback) => {
  for (const $element of $elements) {
    $element.addEventListener(eventType, callback);
  }
};

export const cardQueries = [
  ["field", "uri"],
  ["field", "label"],
  ["field", "image"],
  ["field", "totalTime"],
];

/**
 * skeleton card
 */

export const $skeletonCard = `
  <div class="card skeleton-card">
      <div class="skeleton card-banner"></div>

      <div class="card-body">
        <div class="skeleton card-title"></div>
        <div class="skeleton card-text"></div>
      </div>
  </div>
`;

/** {saveRecipe to localStorage} */

window.saveRecipe = function (button, recipeId, recipeName) {
  const isSaved = localStorage.getItem(`jikoni-recipe-${recipeId}`);

  // Check if the recipe is already saved
  if (isSaved) {
    // Remove the recipe from localStorage
    localStorage.removeItem(`jikoni-recipe-${recipeId}`);
    button.classList.remove("saved");
    button.classList.add("removed");
    showNotification("Recipe removed from bookmarks");
  } else {
    // Ensure recipeName is defined before using it
    if (!recipeName) {
      console.error("Recipe name is undefined.");
      showNotification("Error: Recipe already removed.", true);
      return; // Exit the function if recipeName is not defined
    }

    // Dynamically update cardQueries with the clicked recipe name
    const dynamicCardQueries = [
      ["q", recipeName], // Update the query to the clicked recipe name
      ["field", "uri"],
      ["field", "label"],
      ["field", "image"],
      ["field", "totalTime"],
    ];

    console.log("Query Parameters:", dynamicCardQueries); // Log the dynamic query parameters

    fetchData(dynamicCardQueries, function (data) {
      console.log("Fetch Data Response:", data); // Log the entire response object

      // Check if the response is valid
      if (!data || typeof data !== "object") {
        showNotification("Error fetching recipe data.", "error-notification");
        return;
      }

      // Check if there are hits and store the first one
      if (data.hits && Array.isArray(data.hits) && data.hits.length > 0) {
        const recipeData = data.hits[0]; // Get the first recipe
        // Use recipeId as part of the key to ensure uniqueness
        window.localStorage.setItem(
          `jikoni-recipe-${recipeId}`, // Unique key for each recipe
          JSON.stringify(recipeData) // Store the first recipe object
        );
        console.log("Stored Recipe Data:", recipeData); // Log the stored recipe data

        // Update button state and show notification
        button.classList.remove("removed");
        button.classList.add("saved");
        showNotification("Recipe saved to bookmarks");
      } else {
        console.warn("No recipes found in the response.");
        showNotification("No recipes found. Please try again.");
      }
    });
  }
};
/** {showNotification} */

const /** {NodeElement} */ $snackbarContainer = document.createElement("div");
$snackbarContainer.classList.add("snackbar-container");
document.body.appendChild($snackbarContainer);

function showNotification(message, isError = false) {
  // Add isError parameter
  const /** {NodeElement} */ $snackbar = document.createElement("div");
  $snackbar.classList.add("snackbar");

  // Add error class if isError is true
  if (isError) {
    $snackbar.classList.add("error-notification");
  }

  $snackbar.innerHTML = `<p class="body-medium">${message}</p>`;
  $snackbarContainer.appendChild($snackbar);
}
