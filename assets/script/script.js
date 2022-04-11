var searchButtonEl = document.querySelector('#searchButton');
var cityNameEl = document.querySelector('#cityName');
var listGroupEl = document.querySelector('#listGroup');
var apiKey = "3c32b0a0d311aa42aef0f88c6c69c071";
var forecastDisplayEl = document.querySelector('#forecastDisplay');
var futureWeatherContainerEl = document.querySelector('#futureWeatherContainer');


var searchButtonHandler = function (event) {
  event.preventDefault();

  var cityName = cityNameEl.value;
  if (cityName) {
    getCityWeather(cityName);
  } else {
    alert('Please enter a cityname');
    return;
  }

  var previousCityNames = JSON.parse(localStorage.getItem("searchHistory"));
  if (previousCityNames == null) {
    previousCityNames = [];
  }
  previousCityNames.push(cityName);
  localStorage.setItem("searchHistory", JSON.stringify(previousCityNames));
  displaySearchHistory();
};

var getCityWeather = function (city) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayTodayWeather(data, city);
          var latitude = data.coord.lat;
          var longitude = data.coord.lon;
          var uvapiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;
          fetch(uvapiUrl)
            .then(function (response) {
              if (response.ok) {
                response.json().then(function (uvdata) {
                  displayUvIndex(uvdata);
                });
              } else {
                // console.log("Error on uvindex api c" + response.statusText);
              }
            })

          var forecastapiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;
          fetch(forecastapiUrl)
            .then(function (response) {
              if (response.ok) {
                response.json().then(function (dataforecast) {
                  displayFutureForecast(dataforecast, city);
                });
              } else {
                alert('Error: ' + response.statusText);
              }
            })
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })

};

var displayTodayWeather = function (weather, weatherData) {
  if (weather.length === 0) {
    cityWeatherDisplayEl.textContent = 'No content found.';
    return;
  }
  var cityWeatherDisplayEl = document.querySelector('#cityWeatherDisplay');
  $(cityWeatherDisplayEl).empty();
  var cityDisplayEl = document.createElement('h2');
  cityDisplayEl.classList = 'col-9';
  cityDisplayEl.innerHTML = `${weatherData} (${moment().format("MM/DD/YYYY")}) <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}.png"/>  `;
  cityWeatherDisplayEl.append(cityDisplayEl);
  var displayEl = document.createElement('p');
  displayEl.id = 'todayweather';
  displayEl.classList = 'col-9';
  displayEl.innerHTML = `Temperature: ${Math.floor((weather.main.temp - 273.15) * 1.8 + 32)} °F <br> Humidity: ${weather.main.humidity} %<br> Wind Speed: ${weather.wind.speed} MPH<br>`;
  cityWeatherDisplayEl.append(displayEl);
};

var displayFutureForecast = function (weatherForecast, weatherDataForecast) {
  if (weatherForecast.length === 0) {
    forecastDisplayEl.textContent = 'No content found.';
    return;
  }
  $("#futureWeatherContainer").children(".card").remove();

  var currentDate = moment().format("MM/DD/YYYY");
  var previousDate = "";
  var delay = 500;
  var numDaysDisplayed = 0;
  for (var i = 0; i < weatherForecast.list.length && numDaysDisplayed < 5; i++) {
    var dateTime = weatherForecast.list[i].dt_txt;
    var temp = Math.floor((weatherForecast.list[i].main.temp - 273.15) * 1.8 + 32);
    var humidity = weatherForecast.list[i].main.humidity;
    var icon = weatherForecast.list[i].weather[0].icon;

    var parsedDate = moment(dateTime).format("MM/DD/YYYY");


    if (previousDate != parsedDate && parsedDate != currentDate) {
      var newEl = document.createElement("div");
      newEl.classList = 'card col-2 m-3 weatherblock';
      newEl.innerHTML = `<p>Date: ${parsedDate}</p>\
      <img id=\"wicon\" src=\"http://openweathermap.org/img/wn/${icon}.png\" width=\"50px\" height=\"50px\" alt=\"icon\"></img>\
      <p>Temp: ${temp} °F </p>\
      <p>Humidity: ${humidity} %</p> `;
      // $(newEl).hide();
      $("#futureWeatherContainer").append(newEl);
      // $(newEl).delay(delay).fadeIn("slow");
      // delay += 500;
      numDaysDisplayed++;
    }
    previousDate = parsedDate;
  }
  $(futureWeatherContainerEl).show();

};

var displayUvIndex = function (uvdata) {
  var uvi = uvdata.current.uvi;
  var uviEl = document.createElement("p");
  uviEl.innerHTML = `UV Index: <span id=\"uvIndexColor\"> ${uvi} </span>`;
  $("#todayweather").append(uviEl);

  if (uvi >= 0 && uvi <= 2) {
    $("#uvIndexColor").css("background-color", "#3EA72D").css("color", "white");
  } else if (uvi >= 3 && uvi <= 5) {
    $("#uvIndexColor").css("background-color", "#FFF300").css("color", "white");
  } else if (uvi >= 6 && uvi <= 7) {
    $("#uvIndexColor").css("background-color", "#F18B00").css("color", "white");
  } else if (uvi >= 8 && uvi <= 10) {
    $("#uvIndexColor").css("background-color", "#E53210").css("color", "white");
  } else {
    $("#uvIndexColor").css("background-color", "#B567A4").css("color", "white");
  }
}

var displaySearchHistory = function () {

  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistory == null) {
    searchHistory = [];
  }
  $(listGroupEl).empty();
  for (var i = 0; i < searchHistory.length; i++) {
    var cityList = document.createElement('button');
    cityList.classList = "btn btn-light historybutton";
    cityList.textContent = searchHistory[i];
    listGroupEl.prepend(cityList);
  }
  $(".historybutton").click(function () {
    var cityList = $(this).text();
    getCityWeather(cityList);
  });
}



searchButtonEl.addEventListener("click", searchButtonHandler);
$(futureWeatherContainerEl).hide();
displaySearchHistory();