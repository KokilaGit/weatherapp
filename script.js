//fetching weather information from weatherApI -3
const getweather = async function (userCityValue) {
  //    let response = await fetch(`https://api.weatherapi.com/v1/current.json?key=868b9dedcd7f44fcbe2172950231705&q=${userCityValue}&aqi=no`)
  let response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=868b9dedcd7f44fcbe2172950231705&q=${userCityValue}&days=7&aqi=no&alerts=no`
  );

  let responseData = await response.json();
  return responseData;
};
//getting element where the weather details are displayed
const weatherDiv = document.getElementById("weather");

//function to get values from weatherAPI and accessing it for display -2 & 5
const displayWeather = async function (userCityValue) {
  let weatherFlex;
  if (document.querySelector(".weather-flex") === null) {
    weatherFlex = document.createElement("div");
    weatherFlex.setAttribute("class", "weather-flex");
    weatherDiv.appendChild(weatherFlex);
  } else {
    weatherFlex = document.querySelector(".weather-flex");
  }
  let displayList = await getweather(userCityValue);
  weatherFlex.innerHTML = `<h1> ${displayList.location.name} <img src = "${displayList.current.condition.icon}" alt ="" /></h1>`;
  weatherFlex.innerHTML += `<p>Temperature: ${displayList.current.temp_f}°F</p>`;
  weatherFlex.innerHTML += `<p>Humidity: ${displayList.current.humidity}</p>`;
  weatherFlex.innerHTML += `<p>Wind-speed: ${displayList.current.wind_mph}m/h</p>`;

  //to check button element doesn't repeat everytime from local storage array
  if (document.getElementById("ulBtn") != null) {
    document.getElementById("ulBtn").remove();
  }
  //creating ul element to add city button elements displaying on the side - 5
  let ulElement = document.createElement("ul");
  ulElement.setAttribute("id", "ulBtn");
  document.getElementById("searchedCity").appendChild(ulElement);

  //calling local storage array
  let searchedCityArr = storedCities(userCityValue);
  for (let i = 0; i < searchedCityArr.length; i++) {
    let liBtn = document.createElement("li");
    liBtn.setAttribute("class", "btn");
    //adding event listener to do action when the city button is clicked
    liBtn.addEventListener("click", function () {
      displayWeather(searchedCityArr[i]);
    });
    liBtn.innerHTML = `<button id = "cityButton" type = "button">${searchedCityArr[i]}</button>`;
    document.getElementById("ulBtn").appendChild(liBtn);
  }
  const displayFutureWeather = document.getElementById("weather-forecast");

  const sevenDayForecast = displayList.forecast.forecastday;
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
  displayFutureWeather.innerHTML = "";
  sevenDayForecast.forEach((element) => {
    let dateStr = new Date(element.date + " 00:00");
    console.log("DAY - ", weekday[dateStr.getDay()]);
    displayFutureWeather.innerHTML += `<div class="weather-forecast-item">
     <div class="day">${weekday[dateStr.getDay()]}</div>
     <img src =${element.day.condition.icon} alt="weather-icon" class="w-icon">
     <div class="temp">Night-${element.day.mintemp_f}&#176; C</div>
     <div class="temp">Day-${element.day.maxtemp_f}&#176; C</div>
   </div> `;
    console.log(displayFutureWeather.innerHTML);
  });
};

//adding event listener when submit button is clicked from the form - 1
const submitInfo = document.getElementById("submitBtn");
submitInfo.addEventListener("click", function (event) {
  event.preventDefault();
  const userCityValue = document.getElementById("city").value;
  displayWeather(userCityValue);
});

//storing cities entered by user in local storage - 4
const storedCities = function (city) {
  let cityArr = [];
  if (localStorage.getItem("cities") != null) {
    //converting string of cities to array
    cityArr = JSON.parse(localStorage.getItem("cities"));
    //add city to the local storage if it is not in the array
    if (!cityArr.includes(city)) {
      cityArr.push(city);
    }
    //adding new city to local storage again by converting into string
    let cityArr_sterilized = JSON.stringify(cityArr);
    localStorage.setItem("cities", cityArr_sterilized);
  } else {
    cityArr.push(city);
    //converting array of cities to string to store in local storage
    let cityArr_serialized = JSON.stringify(cityArr);
    localStorage.setItem("cities", cityArr_serialized);
  }
  return cityArr;
};
const pageLoad = function () {
  //creating ul element to add city button elements displaying on the side - 5
  let ulElement = document.createElement("ul");

  ulElement.setAttribute("id", "ulBtn");
  document.getElementById("searchedCity").appendChild(ulElement);
  let searchedCityArr = JSON.parse(localStorage.getItem("cities"));
  //creating div to add city button elements from local storage array and appending to ul
  for (let i = 0; i < searchedCityArr.length; i++) {
    let bonusBtn = document.createElement("li");
    bonusBtn.setAttribute("class", "btn");
    //adding event listener to do action when the city button is clicked
    bonusBtn.addEventListener("click", function () {
      displayWeather(searchedCityArr[i]);
    });
    bonusBtn.innerHTML = `<button id = "cityButton" type = "button">${searchedCityArr[i]}</button>`;
    document.getElementById("ulBtn").appendChild(bonusBtn);
  }
};
