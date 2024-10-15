/**
 * @license MIT
 * @author eMode18 <ewagandi@gmail.com>
 * @copyright eMode 2024
 */
"use strict";

window.ACCESS_POINT = "https://api.edamam.com/api/recipes/v2";

const APP_ID = "6341ef58";
const API_KEY = "7fa0fbcc144db46fe1f8f7933567c51c";
const TYPE = "public";

/**
 *
 * @param {Array} queries Array of key-value pairs for query parameters (optional)
 * @param {Function} successCallback Success callback function
 */
export const fetchData = async function (queries = [], successCallback) {
  try {
    // Construct base URL with required parameters
    const baseUrl = `${ACCESS_POINT}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}`;

    // If there are any optional queries, construct them properly
    const queryString = queries.length
      ? "&" +
        queries
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&")
      : "";

    // Complete URL with optional query string
    const url = baseUrl + queryString;

    // Fetch the data from the API
    const response = await fetch(url);

    // Handle response
    if (response.ok) {
      const data = await response.json();
      console.log("Data: ", data);
      successCallback(data);
    } else {
      console.error("Network response was not ok", response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
