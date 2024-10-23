/**
 * @license MIT
 * @author eMode18 <ewagandi@gmail.com>
 * @copyright eMode 2024
 */
"use strict";

/**
 * Import modules
 */
import { fetchData } from "./api.js";
import { $skeletonCard, cardQueries } from "./global.js";
import { getTime } from "./module.js";

/**
 * Accordion
 */

const /** {NodeList} */ $accordions =
    document.querySelectorAll("[data-accordion]");

/**
 * @param {NodeElement} $element Accordion element
 */

const initAccordion = function ($element) {
  const /** {NodeElement} */ $button = $element.querySelector(
      "[data-accordion-btn]"
    );
  let /** {Boolean} */ isExpanded = false;

  $button.addEventListener("click", function () {
    isExpanded = !isExpanded;
    this.setAttribute("aria-expanded", isExpanded);
  });
};

for (const $accordion of $accordions) {
  initAccordion($accordion);
}

/**
 * Filter bar toggle for mobile screen
 */

const /** {NodeElement} */ $filterBar =
    document.querySelector("[data-filter-bar]");
const /** {NodeList} */ $filterToggles = document.querySelectorAll(
    "[data-filter-toggle]"
  );
const /** {NodeElement} */ $overlay = document.querySelector("[data-overlay]");

// Update overlay state
const updateOverlayState = () => {
  if ($filterBar.classList.contains("active")) {
    $overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    $overlay.classList.remove("active");
    document.body.style.overflow = "visible";
  }
};

// Modify the click event listener for filter toggles
addEventOnElements($filterToggles, "click", function (e) {
  e.stopPropagation(); // Prevent event from bubbling up
  $filterBar.classList.toggle("active");
  updateOverlayState();
});

// Add event listener to close filter bar when clicking outside
document.addEventListener("click", function (e) {
  if (
    !$filterBar.contains(e.target) &&
    !e.target.hasAttribute("data-filter-toggle")
  ) {
    $filterBar.classList.remove("active");
    updateOverlayState();
  }
});

/**
 * Filter submit and clear
 */

const /** {NodeElement} */ $filterSubmit = document.querySelector(
    "[data-filter-submit]"
  );
const /** {NodeElement} */ $filterClear = document.querySelector(
    "[data-filter-clear]"
  );
const /** {NodeElement} */ $filterSearch = $filterBar.querySelector(
    "input[type='search']"
  );

$filterSubmit.addEventListener("click", function () {
  const /** {NodeList} */ $filterCheckboxes =
      $filterBar.querySelectorAll("input:checked");
  const /** {Array} */ queries = [];

  if ($filterSearch.value) queries.push(["q", $filterSearch.value]);

  if ($filterCheckboxes.length) {
    for (const $checkbox of $filterCheckboxes) {
      const /** {String} */ key =
          $checkbox.parentElement.parentElement.dataset.filter;
      queries.push([key, $checkbox.value]);
    }
  }

  window.location = queries.length
    ? `?${queries.join("&").replace(/,/g, "=")}`
    : "/recipes.html";
});

$filterSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") $filterSubmit.click();
});

$filterClear.addEventListener("click", function () {
  const /** {NodeList} */ $filterCheckboxes =
      $filterBar.querySelectorAll("input:checked");
  $filterCheckboxes?.forEach((input) => (input.checked = false));
  $filterSearch.value = "";
  updateFilterCount(); // update the filter count
});

// Handle existing query parameters
const /** {String} */ queryStr = window.location.search.slice(1);
const /** {Array} */ queries =
    queryStr &&
    queryStr.split("&").map((/** {String} */ item) => item.split("="));

const /** {NodeElement} */ $filterCount = document.querySelector(
    "[data-filter-count]"
  );

// Function to update filter count
const updateFilterCount = () => {
  const activeFilters = $filterBar.querySelectorAll("input:checked").length;
  if (activeFilters > 0) {
    $filterCount.style.display = "block";
    $filterCount.innerHTML = activeFilters;
  } else {
    $filterCount.style.display = "none";
  }
};

if (queries.length) {
  updateFilterCount();
} else {
  $filterCount.style.display = "none";
}

queryStr &&
  queryStr.split("&").map((/** {String} */ item) => {
    if (item.split("=")[0] === "q") {
      $filterBar.querySelector("input[type='search']").value = item
        .split("=")[1]
        .replace(/%20/g, " ");
    } else {
      $filterBar.querySelector(
        `[value="${item.split("=")[1].replace(/%20/g, " ")}"]`
      ).checked = true;
    }
  });

// Update filter count after handling query parameters
updateFilterCount();

const /** {NodeElement} */ $filterBtn =
    document.querySelector("[data-filter-btn]");

window.addEventListener("scroll", (e) => {
  $filterBtn.classList[window.scrollY >= 120 ? "add" : "remove"]("active");
});

/**
 * Request and render recipes
 */

const /** {NodeElement} */ $gridList =
    document.querySelector("[data-grid-list]");

const /** {NodeElement} */ $loadMore =
    document.querySelector("[data-load-more]");

const /** {Array} */ defaultQueries = [
    ["mealType", "breakfast"],
    ["mealType", "lunch"],
    ["mealType", "dinner"],
    ["mealType", "snack"],
    ["mealType", "teatime"],
    ...cardQueries,
  ];

$gridList.innerHTML = $skeletonCard.repeat(20);

let /** {String} */ nextPageUrl = "";

const renderRecipes = function (data) {
  data.hits.map((item, index) => {
    const {
      recipe: { image, label: title, totalTime: cookingTime, uri },
    } = item;

    const /** {String} */ recipeId = uri.split("_")[1];
    const /** {Undefined || Boolean} */ isSaved = window.localStorage.getItem(
        `jikoni-recipe-${recipeId}`
      );

    const /** {NodeElement} */ $card = document.createElement("div");
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
                aria-label="Add to saved recipes" 
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
        </div>`;
    $gridList.appendChild($card);
  });
};

let /** {Boolean} */ requestedBefore = true;

fetchData(queries || defaultQueries, (data) => {
  const {
    _links: { next },
  } = data;
  nextPageUrl = next?.href;

  $gridList.innerHTML = "";
  requestedBefore = false;

  if (data.hits.length) {
    renderRecipes(data);
  } else {
    $loadMore.innerHTML = `<p class="body-medium info-text">No recipes found</p>`;
  }
});

const /** {Number} */ CONTAINER_MAX_WIDTH = 1200;
const /** {Number} */ CONTAINER_MAX_CARD = 6;

window.addEventListener("scroll", async (e) => {
  if (
    $loadMore.getBoundingClientRect().top < window.innerHeight &&
    !requestedBefore &&
    nextPageUrl
  ) {
    $loadMore.innerHTML = $skeletonCard.repeat(
      Math.round(
        ($loadMore.clientWidth / CONTAINER_MAX_WIDTH) * CONTAINER_MAX_CARD
      )
    );
    requestedBefore = true;

    const /** {Promise} */ response = await fetch(nextPageUrl);
    const /** {Object} */ data = await response.json();

    const {
      _links: { next },
    } = data;
    nextPageUrl = next?.href;

    renderRecipes(data);
    $loadMore.innerHTML = "";
    requestedBefore = false;
  }

  if (!nextPageUrl) {
    $loadMore.innerHTML = `<p class="body-medium info-text">No more recipes</p>`;
  }
});
