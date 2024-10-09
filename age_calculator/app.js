let dateInput = document.getElementById("date");

// Disable selecting future dates
dateInput.max = new Date().toISOString().split("T")[0];

let result = document.getElementById("result");

function calculateAge() {
  // Check if the input field has any value
  if (!dateInput.value) {
    result.innerHTML = "Please select your date of birth.";
    return;
  }

  let dateOfBirth = new Date(dateInput.value);

  let day1 = dateOfBirth.getDate();
  let month1 = dateOfBirth.getMonth() + 1;
  let year1 = dateOfBirth.getFullYear();

  let today = new Date();

  let day2 = today.getDate();
  let month2 = today.getMonth() + 1;
  let year2 = today.getFullYear();

  let d3, m3, y3;

  y3 = year2 - year1;

  if (month2 >= month1) {
    m3 = month2 - month1;
  } else {
    y3--;
    m3 = 12 + month2 - month1;
  }

  if (day2 >= day1) {
    d3 = day2 - day1;
  } else {
    m3--;
    d3 = getDaysInMonth(year1, month1) + day2 - day1;
  }

  if (m3 < 0) {
    m3 = 11;
    y3--;
  }

  // Create age message based on non-zero date values
  let ageMessage = [];

  if (y3 > 0) {
    ageMessage.push(`<span>${y3}</span> ${pluralize(y3, "year")}`);
  }

  if (m3 > 0) {
    ageMessage.push(`<span>${m3}</span> ${pluralize(m3, "month")}`);
  }

  if (d3 > 0) {
    ageMessage.push(`<span>${d3}</span> ${pluralize(d3, "day")}`);
  }

  // Handle cases where all values are 0 (newborns)
  if (ageMessage.length === 0) {
    result.innerHTML = "You are less than a day old.";
  } else {
    result.innerHTML = `You are ${ageMessage.join(", ")} old.`;
  }

  // Check if today is the user's birthday
  if (day1 === day2 && month1 === month2) {
    result.innerHTML = `<strong>Happy Birthday!</strong> ` + result.innerHTML;
  }
}

// Return the singular or plural form of Year/Month/Day based on value
function pluralize(dateValue, unit) {
  return dateValue === 1 ? unit : unit + "s";
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
