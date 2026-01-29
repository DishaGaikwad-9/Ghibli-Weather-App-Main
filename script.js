const weatherText = document.getElementById("weather-text");
const cityInput = document.getElementById("cityInput");
const getWeatherButton = document.getElementById("getWeather");
const muteButton = document.getElementById("muteButton");
const muteIcon = document.getElementById("muteIcon"); // Reference to the <img> inside the button
const tempDisplay = document.getElementById("temp-display");
const toggleUnitButton = document.getElementById("toggle-unit");

const clickSound = new Audio("button-click.mp3");

let isMuted = false;
let currentTempCelsius = null;
let isCelsius = true;
let currentMusic = new Audio("default-music.mp3"); // Default startup music
currentMusic.loop = true;
currentMusic.play(); // Start playing music when app loads

// 🎵 Mute/Unmute Button Functionality
muteButton.addEventListener("click", function () {
    isMuted = !isMuted;
    clickSound.play();

    if (isMuted) {
        currentMusic.pause();
        muteIcon.src = "totoro-muted.png";  // Change Totoro face to muted
    } else {
        currentMusic.play();
        muteIcon.src = "totoro-unmuted.png";  // Change Totoro face to unmuted
    }
});

// 🌦️ Fetch Weather Data
getWeatherButton.addEventListener("click", function () {
    const city = cityInput.value;
    if (city === "") {
        weatherText.innerHTML = "⚠️ Please enter a city name!";
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1faf1baa5ec8e1fc865f8916459b17c0&units=metric`)
        .then(response => response.json())
        .then(data => {
            const weatherMain = data.weather[0].main;
            currentTempCelsius = data.main.temp;
            updateWeatherUI(weatherMain);
        })
        .catch(error => {
            weatherText.innerHTML = "⚠️ Error fetching weather data!";
            console.error(error);
        });
});

// 🎨 Update UI Based on Weather
function updateWeatherUI(weather) {
    let backgroundImg = "default.jpg";
    let newMusicSrc = "default-music.mp3"; // Default background music
    let message = "🌦️ Enter a city to see the weather!";

    switch (weather.toLowerCase()) {
        case "clear":
            backgroundImg = "sunny.jpg";
            newMusicSrc = "sunny-music.mp3";
            message = "☀️ It's sunny! Perfect time for a walk in a Ghibli-like meadow.";
            break;
        case "clouds":
            backgroundImg = "cloudy.jpg";
            newMusicSrc = "cloudy-music.mp3";
            message = "☁️ A cloudy day... Maybe a great time for some tea and a Ghibli movie!";
            break;
        case "rain":
            backgroundImg = "rainy.jpg";
            newMusicSrc = "rainy-music.mp3";
            message = "🌧️ It's raining! Don't forget your umbrella, just like Totoro!";
            break;
        case "snow":
            backgroundImg = "snow.jpg";
            newMusicSrc = "snow-music.mp3";
            message = "❄️ Snow is falling! Time for a cozy blanket and hot chocolate.";
            break;
    }

    document.body.style.backgroundImage = `url('${backgroundImg}')`;
    weatherText.innerHTML = message;

    // 🔄 Switch Music Only If Not Muted
    if (!isMuted && currentMusic.src !== newMusicSrc) {  
        currentMusic.pause();  // Stop current music
        currentMusic = new Audio(newMusicSrc); // Change to new music
        currentMusic.loop = true;
        currentMusic.play();
    }

    updateTemperatureDisplay();
}

// 🌡️ Temperature Conversion
toggleUnitButton.addEventListener("click", function () {
    isCelsius = !isCelsius;
    updateTemperatureDisplay();
});

function updateTemperatureDisplay() {
    const temp = isCelsius ? currentTempCelsius : (currentTempCelsius * 9/5) + 32;
    tempDisplay.innerHTML = `${temp.toFixed(1)}°${isCelsius ? "C" : "F"}`;
}
