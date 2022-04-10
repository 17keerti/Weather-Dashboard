var searchButtonEl = document.querySelector('#searchButton');
var cityNameEl = document.querySelector('#cityName');
var listGroupEl = document.querySelector('#listGroup');
var apiKey = "3c32b0a0d311aa42aef0f88c6c69c071";
var forecastDisplayEl = document.querySelector('#forecastDisplay');
var futureWeatherContainerEl = document.querySelector('#futureWeatherContainer');


var searchButtonHandler = function (event) {
  event.preventDefault();

  var cityName = cityNameEl.value;
  console.log(cityName);
  if (cityName) {
    getCityWeather(cityName);
  } else {
    alert('Please enter a cityname');
  }
  var cityList = document.createElement('li');
  cityList.classList = 'list-group-item';
  cityList.textContent = cityName;
  listGroupEl.appendChild(cityList);
};

var getCityWeather = function (city) {

  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
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
                console.log("Error on uvindex apil call  " + response.statusText);
              }
            })

          // future 
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
    console.log(weather);
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
    displayEl.innerHTML = `Temperature: ${weather.main.temp} <br> Humidity: ${weather.main.humidity} %<br> Wind Speed: ${weather.wind.speed} MPH<br>`;
    cityWeatherDisplayEl.append(displayEl);
    console.log(weatherData);
  };

  var displayFutureForecast = function (weatherForecast, weatherDataForecast) {
    if (weatherForecast.length === 0) {
      forecastDisplayEl.textContent = 'No content found.';
      return;
    }
    console.log(weatherForecast);
    console.log("getCityForecastWeatherDisplay");
    console.log($("#futureWeatherContainer").children(".card"));
    $("#futureWeatherContainer").children(".card").remove();
    console.log(moment().hour());
  
    var currentDate = "";
    var delay = 500;
    var numDaysDisplayed = 0;
    for (var i = 0; i < weatherForecast.list.length && numDaysDisplayed < 5; i++) {
      var dateTime = weatherForecast.list[i].dt_txt;
      var temp = weatherForecast.list[i].main.temp;
      var humidity = weatherForecast.list[i].main.humidity;
      var icon = weatherForecast.list[i].weather[0].icon;
  
      var parsedDate = moment(dateTime).format("MM/DD/YYYY");
  
      if (currentDate != parsedDate) {
        currentDate = parsedDate;
        // Show a new UI element
        var newEl = document.createElement("div");
        newEl.classList = 'card col-2 m-3 weatherblock';
        newEl.innerHTML = `<p>Date: ${currentDate}</p>\
      <img id=\"wicon\" src=\"http://openweathermap.org/img/wn/${icon}.png\" alt=\"icon\"></img>\
      <p>Temp: ${temp} F</p>\
      <p>Humidity: ${humidity} %</p> `;
        $(newEl).hide();
        $("#futureWeatherContainer").append(newEl);
        $(newEl).delay(delay).fadeIn("slow");
        delay += 500;
        numDaysDisplayed++;
      }
    }
    $(futureWeatherContainerEl).show();
  
  };

  var displayUvIndex = function (uvdata) {
    console.log(uvdata);
    var uvi = uvdata.current.uvi;
    console.log(uvi);
    $("#todayweather").append("UV Index: " + uvi);
  
  }

searchButtonEl.addEventListener('click', searchButtonHandler);
$(futureWeatherContainerEl).hide();