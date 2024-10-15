/**
 * @license MIT
 * @author eMode18 <ewagandi@gmail.com>
 * @copyright eMode 2024
 */

"use strict";

/**
 *
 * @param {Number} minute cookingTime in minutes
 * @returns {String} Formatted time string (e.g., "2 hours and 30 minutes", "1 hour", "1 day", etc.)
 */

export const getTime = (minute) => {
  // Handle scenario with no cooking time or time is less than a minute
  if (minute === 0) return "<1 minute";

  const days = Math.floor(minute / 1440); // 1 day = 1440 minutes
  const hours = Math.floor((minute % 1440) / 60); // remaining hours after extracting days
  const minutes = minute % 60; // remaining minutes after extracting days and hours

  let timeString = "";

  if (days > 0) {
    timeString += `${days} ${days === 1 ? "day" : "days"}`;
  }

  if (hours > 0) {
    if (timeString) timeString += " and ";
    timeString += `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  if (minutes > 0) {
    if (timeString) timeString += " and ";
    timeString += `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  return timeString;
};
