var apiKey = "9b81d3e4265e2d1a5b8b73f1591ec139"; // Замените на ваш актуальный API ключ

document.getElementById("search-btn").addEventListener("click", function () {
  var cityName = document.getElementById("search-box").value;

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
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
});

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

  // Создаем объект, который будет содержать прогнозы погоды по дням недели
  var weeklyForecast = {};

  // Проходим по всем элементам списка прогнозов и группируем их по дням недели
  forecasts.forEach((forecast) => {
    var date = new Date(forecast.dt * 1000);
    var dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

    // Если для данного дня недели еще не был добавлен прогноз, добавляем его
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

  // Выводим прогноз погоды на неделю по дням недели
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

