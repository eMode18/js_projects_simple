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
