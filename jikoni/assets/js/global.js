/**
 * @license MIT
 * @author eMode18 <ewagandi@gmail.com>
 * @copyright eMode 2024
 */

"use strict";

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

window.saveRecipe = function (button, recipeId) {
  const isSaved = localStorage.getItem(`jikoni-recipe-${recipeId}`);

  if (isSaved) {
    localStorage.removeItem(`jikoni-recipe-${recipeId}`);
    button.classList.remove("saved");
    button.classList.add("removed");
    showNotification("Recipe removed from bookmarks");
  } else {
    localStorage.setItem(`jikoni-recipe-${recipeId}`, "true");
    button.classList.remove("removed");
    button.classList.add("saved");
    showNotification("Recipe saved to bookmarks");
  }
};

/** {showNotification} */

const /** {NodeElement} */ $snackbarContainer = document.createElement("div");
$snackbarContainer.classList.add("snackbar-container");
document.body.appendChild($snackbarContainer);

function showNotification(message) {
  const /** {NodeElement} */ $snackbar = document.createElement("div");
  $snackbar.classList.add("snackbar");
  $snackbar.innerHTML = `<p class="body-medium">${message}</p>`;
  $snackbarContainer.appendChild($snackbar);
}
