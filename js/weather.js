var apiKey = "9b81d3e4265e2d1a5b8b73f1591ec139";
function searchWeatherByCity() {
  var cityName = document.getElementById("search-box").value.trim();
  if (cityName === "") {
    alert("Please enter a city name.");
    return;
  }

  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      displayWeatherData(data.city, cityName);
      displayWeeklyForecast(data.list);
      document.getElementById("preloader").style.display = "none";
      document.getElementById("content").style.display = "block";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed!");
    });
}

function displayWeatherData(cityData, cityName) {
  var cityDiv = document.querySelector(".city");
  var dateDiv = document.querySelector(".date");

  cityDiv.textContent = cityName;
  dateDiv.textContent = `Sunrise: ${new Date(
    cityData.sunrise * 1000
  ).toLocaleString()} | Sunset: ${new Date(
    cityData.sunset * 1000
  ).toLocaleString()}`;
}

function displayWeeklyForecast(forecasts) {
  var forecastData = document.getElementById("forecast-data");
  forecastData.innerHTML = "";

  var weeklyForecast = {};

  forecasts.forEach((forecast) => {
    var date = new Date(forecast.dt * 1000);
    var dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

    if (!weeklyForecast[dayOfWeek]) {
      weeklyForecast[dayOfWeek] = {
        date: date,
        highTemp: forecast.main.temp_max,
        lowTemp: forecast.main.temp_min,
        weatherDescription: forecast.weather[0].description,
        weatherIcon: forecast.weather[0].icon,
      };
    }
  });

  Object.keys(weeklyForecast).forEach((dayOfWeek) => {
    var forecast = weeklyForecast[dayOfWeek];

    var row = document.createElement("tr");
    row.innerHTML = `
      <td>${dayOfWeek}</td>
      <td>${forecast.highTemp}°C</td>
      <td>${forecast.lowTemp}°C</td>
      <td>${forecast.weatherDescription}</td>
      <td><img src="https://openweathermap.org/img/wn/${forecast.weatherIcon}.png" alt="Weather icon for ${forecast.weatherDescription}"></td>
    `;
    forecastData.appendChild(row);
  });
}

function searchWeatherByGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          var search = document.getElementById("search-box");
          var cityName = data.city.name;
          search.value = cityName;
          displayWeatherData(data.city, cityName);
          displayWeeklyForecast(data.list);
          document.getElementById("preloader").style.display = "none";
          document.getElementById("content").style.display = "block";
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed");
        });
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
    alert("Geolocation is not supported by this browser.");
  }
}

searchWeatherByGeolocation();
document
  .getElementById("search-btn")
  .addEventListener("click", searchWeatherByCity);
