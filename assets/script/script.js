var searchButtonEl = document.querySelector('#searchButton');
var cityNameEl = document.querySelector('#cityName');
var listGroupEl = document.querySelector('#listGroup');
var apiKey = "3c32b0a0d311aa42aef0f88c6c69c071";
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

searchButtonEl.addEventListener('click', searchButtonHandler);
$(futureWeatherContainerEl).hide();