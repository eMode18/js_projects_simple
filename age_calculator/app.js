let dateInput = document.getElementById("date");

// Disable selecting future dates
dateInput.max = new Date().toISOString().split("T")[0];

let result = document.getElementById("result");

function calculateAge() {
  // Check if a date is selected
  if (!dateInput.value) {
    result.innerHTML = "Please select your date of birth.";
    return; // Stop further execution
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

  result.innerHTML = `You are <span>${y3}</span> years,  <span>${m3} </span> months, and  <span>${d3} </span> days old.`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
