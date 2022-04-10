var searchButtonEl = document.querySelector('#searchButton');
var cityNameEl = document.querySelector('#cityName');
var listGroupEl = document.querySelector('#listGroup');

var searchButtonHandler = function (event) {
  event.preventDefault();

  var cityName = cityNameEl.value;
  console.log(cityName);
  if (cityName) {
    // call function to display city weather
  } else {
    alert('Please enter a cityname');
  }
  var cityList = document.createElement('li');
  cityList.classList = 'list-group-item';
  cityList.textContent = cityName;
  listGroupEl.appendChild(cityList);
};

searchButtonEl.addEventListener('click', searchButtonHandler);
