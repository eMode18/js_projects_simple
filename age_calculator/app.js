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

  let birthdate = dateOfBirth.getDate();
  let month1 = dateOfBirth.getMonth() + 1;
  let year1 = dateOfBirth.getFullYear();

  let today = new Date();

  let currentDate = today.getDate();
  let month2 = today.getMonth() + 1;
  let year2 = today.getFullYear();

  let days, months, years;

  years = year2 - year1;

  if (month2 >= month1) {
    months = month2 - month1;
  } else {
    years--;
    months = 12 + month2 - month1;
  }

  if (currentDate >= birthdate) {
    days = currentDate - birthdate;
  } else {
    months--;
    days = getDaysInMonth(year1, month1) + currentDate - birthdate;
  }

  if (months < 0) {
    months = 11;
    years--;
  }

  // Create age message based on non-zero date values
  let ageMessage = [];

  if (years > 0) {
    ageMessage.push(`<span>${years}</span> ${pluralize(years, "year")}`);
  }

  if (months > 0) {
    ageMessage.push(`<span>${months}</span> ${pluralize(months, "month")}`);
  }

  if (days > 0) {
    ageMessage.push(`<span>${days}</span> ${pluralize(days, "day")}`);
  }

  // Handle cases where all values are 0 (newborns)
  if (ageMessage.length === 0) {
    result.innerHTML = "You are less than a day old.";
  } else {
    result.innerHTML = `You are ${ageMessage.join(", ")} old.`;
  }

  // Check if today is the user's birthday
  if (birthdate === currentDate && month1 === month2) {
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
