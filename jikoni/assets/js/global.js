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
