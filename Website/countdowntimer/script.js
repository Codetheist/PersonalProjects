//let radioCategory = document.getElementById("radioCategory");
//let title = document.getElementById("title");

let year = document.getElementById("year");
let month = document.getElementById("month");
let day = document.getElementById("day");
let hour = document.getElementById("hour");
let minute = document.getElementById("minute");
let second = document.getElementById("second");

// Display countdown timer
let years = document.getElementById("years");
let months = document.getElementById("months");
let days = document.getElementById("days");
let hours = document.getElementById("hours");
let minutes = document.getElementById("minutes");
let seconds = document.getElementById("seconds");
let display = "";

let TODAY = new Date().getTime();

let dateSelected = "";

let differenceInTime = "";
let difference = "";
let count = "";

//Creat a function to start the countdown timer
function calculateCountdown() {

    // Check to see if the input is valid and not empty make sure Februrary is valid
    if (year.value == "" || month.value == "" || day.value == "" || hour.value == "" || minute.value == "" || second.value == "") {
        alert("Please enter a valid date");
    } else if (year.value < 0 || month.value < 0 || day.value < 0 || hour.value < 0 || minute.value < 0 || second.value < 0 || year.value > 9999 || month.value > 12 || day.value > 31 || hour.value > 23 || minute.value > 59 || second.value > 59 || (month.value == 2 && day.value > 29) || (month.value == 2 && day.value == 29 && (year.value % 4 != 0))) {
        alert("Please enter a valid date");
        alert("Please enter a valid date");
    } else {

        dateSelected = new Date(year.value, month.value, day.value, hour.value, minute.value, second.value).getTime();

        // Display the countdown timer
        count = setInterval(function () {
            // Get the difference between the date selected and today
            differenceInTime = dateSelected - TODAY;

            // Get the difference in time in seconds
            difference = Math.floor(differenceInTime / 1000);

            // Calcuations for the countdown timer
            years = Math.floor(difference / 31536000);
            months = Math.floor((difference % 31536000) / 2628000);
            days = Math.floor(((difference % 31536000) % 2628000) / 86400);
            hours = Math.floor((((difference % 31536000) % 2628000) % 86400) / 3600);
            minutes = Math.floor(((((difference % 31536000) % 2628000) % 86400) % 3600) / 60);
            seconds = Math.floor(((((difference % 31536000) % 2628000) % 86400) % 3600) % 60);

            // Display the countdown timer
            document.getElementById("display").innerHTML = years + " Years " + months + " Months " + days + " Days " + hours + " Hours " + minutes + " Minutes " + seconds + " Seconds";

            // If the difference in time is less than 0, then the countdown timer is finished
            if (difference < 0) {
                clearInterval(count);
                document.getElementById("display").innerHTML = "Countdown finished";
            }
        }, 1000);
    }
}

// Function to start the countdown timer
function startCountDown() {
    calculateCountdown();
}

// Function to reset the countdown timer
function resetCountDown() {
    window.location.reload();
}

// Function to get the category for the countdown
// and set the coundown timer to the correct category
/*function getCategory() {
    document.body.addEventListener("click", function (e) {
        category = e.target.value;
        
        switch (category) {
            case "american football":
                timer.innerHTML = "American Football";
                break;
            case "baby":
                timer.innerHTML = "Baby";
                break;
            case "basketball":
                timer.innerHTML = "Basketball";
                break;
            case "birthday":
                timer.innerHTML = "Birthday";
                break;
            case "chinese new year":
                timer.innerHTML = "Chinese New Year";
                break;
            case "christmas":
                timer.innerHTML = "Christmas";
                break;
            case "easter":
                timer.innerHTML = "Easter";
                break;
            case "football":
                timer.innerHTML = "Football";
                break;
            case "generic":
                timer.innerHTML = "Countdown Timer";
                break;
            case "halloween":
                timer.innerHTML = "Halloween";
                break;
            case "new year":
                timer.innerHTML = "New Year";
                break;
            case "retirement":
                timer.innerHTML = "Retirement";
                break;
            case "thanksgiving":
                timer.innerHTML = "Thanksgiving";
                break;
            case "vacation":
                timer.innerHTML = "Vacation";
                break;
            case "valentine's day":
                timer.innerHTML = "Valentine's Day";
                break;
            case "wedding":
                timer.innerHTML = "Wedding";
                break;
            default:
                timer.innerHTML = "Countdown Timer";
                break;
        }
    });
}*/