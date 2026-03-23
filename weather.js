const WEATHER_API_KEY = 'ad9977ec59bfbd6fd46eecd38378e741';

let usingCelsius = true; 
let currentCity = '';   
const cityInput = document.getElementById('cityName');
const searchCityBtn = document.getElementById('searchCityBtn');
const latInput = document.getElementById('latitude');
const lonInput = document.getElementById('longitude');
const searchCoordBtn = document.getElementById('searchCoordBtn');
const addFavoriteBtn = document.getElementById('addFavoriteBtn');
const toggleTempBtn = document.getElementById('toggleTempBtn');
const cityDisplay = document.getElementById('cityDisplay');
const tempDisplay = document.getElementById('tempDisplay');
const descDisplay = document.getElementById('descDisplay');
const coordDisplay = document.getElementById('coordDisplay');
const forecastSection = document.getElementById('forecastSection');
const forecastGrid = document.getElementById('forecastGrid');
const favoritesList = document.getElementById('favoritesList');
function formatTemperature(celsiusTemp) {
    if (usingCelsius) {
        return `${Math.round(celsiusTemp)}°C`;
    } else {
        let fahrenheitTemp = (celsiusTemp * 9/5) + 32;
        return `${Math.round(fahrenheitTemp)}°F`;
    }
}
function beautifyText(text) {
    return text.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
function showUserMessage(message, isError = true) {
    if (isError) {
        alert('⚠️ ' + message);
    } else {
        alert('✅ ' + message);
    }
}
async function getWeatherByCity(cityName) {
    if (!cityName || cityName.trim() === '') {
        showUserMessage('Please enter a city name!');
        return;
    }
    
    try {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${WEATHER_API_KEY}&units=metric`;
        
        let response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                showUserMessage(`Sorry, "${cityName}" doesn't exist in our weather records. Please check the spelling!`);
            } else {
                showUserMessage('Something went wrong. Please try again later.');
            }
            return;
        }
        
        let weatherData = await response.json();
        
        updateCurrentWeather(weatherData);
        currentCity = weatherData.name;
        
        getForecastByCity(cityName);
        
    } catch (error) {
        console.log('Weather fetch error:', error);
        showUserMessage('Network issue. Check your internet connection.');
    }
}

async function getWeatherByCoordinates(lat, lon) {
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        showUserMessage('Please enter valid latitude and longitude numbers!');
        return;
    }
    
    try {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
        let response = await fetch(url);
        
        if (!response.ok) {
            showUserMessage('Invalid coordinates! Make sure they are correct.');
            return;
        }
        
        let weatherData = await response.json();
        
        updateCurrentWeather(weatherData);
        currentCity = weatherData.name;
        
        
        cityInput.value = weatherData.name;
        
        getForecastByCoordinates(lat, lon);
        
    } catch (error) {
        console.log('Coordinates error:', error);
        showUserMessage('Error finding weather with those coordinates.');
    }
}

async function getForecastByCity(cityName) {
    try {
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${WEATHER_API_KEY}&units=metric`;
        let response = await fetch(url);
        
        if (!response.ok) return;
        
        let forecastData = await response.json();
        displayForecastCards(forecastData);
        
        if (forecastData.city && forecastData.city.coord) {
            coordDisplay.innerHTML = `📍 Coordinates: ${forecastData.city.coord.lat.toFixed(4)}°, ${forecastData.city.coord.lon.toFixed(4)}°`;
        }
        
    } catch (error) {
        console.log('Forecast error:', error);
    }
}

async function getForecastByCoordinates(lat, lon) {
    try {
        let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
        let response = await fetch(url);
        
        if (!response.ok) return;
        
        let forecastData = await response.json();
        displayForecastCards(forecastData);
        coordDisplay.innerHTML = `📍 Coordinates: ${lat}, ${lon}`;
        
    } catch (error) {
        console.log('Forecast by coordinates error:', error);
    }
}


function updateCurrentWeather(data) {
    cityDisplay.innerHTML = `📍 ${data.name}, ${data.sys.country}`;
    
    let celsiusTemp = data.main.temp;
    tempDisplay.innerHTML = `🌡️ Temperature: ${formatTemperature(celsiusTemp)}`;
    
    let weatherText = beautifyText(data.weather[0].description);
    descDisplay.innerHTML = `🌤️ Weather: ${weatherText}`;
    
    if (data.coord) {
        coordDisplay.innerHTML = `📍 Coordinates: ${data.coord.lat.toFixed(4)}°, ${data.coord.lon.toFixed(4)}°`;
    }
}

function displayForecastCards(forecastData) {
    
    let dailyForecasts = [];
    let seenDates = new Set();
    
    
    for (let item of forecastData.list) {
        let dateOnly = item.dt_txt.split(' ')[0];
        if (!seenDates.has(dateOnly) && dailyForecasts.length < 3) {
            seenDates.add(dateOnly);
            dailyForecasts.push(item);
        }
        if (dailyForecasts.length === 3) break;
    }
    
    let cards = document.querySelectorAll('.forecast-card');
    
 for (let i = 0; i < dailyForecasts.length && i < cards.length; i++) {
        let forecast = dailyForecasts[i];
        let card = cards[i];
        
        let forecastDate = new Date(forecast.dt_txt);
        let formattedDate = forecastDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        
        card.querySelector('.forecast-date').textContent = formattedDate;
        
        let iconCode = forecast.weather[0].icon;
        let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        card.querySelector('.forecast-icon img').src = iconUrl;
        card.querySelector('.forecast-icon img').alt = forecast.weather[0].description;
        
        card.querySelector('.forecast-temp').textContent = formatTemperature(forecast.main.temp);
        card.querySelector('.forecast-desc').textContent = beautifyText(forecast.weather[0].description);
    }
    
    forecastSection.style.display = 'block';
}
function loadFavorites() {
    let savedFavorites = localStorage.getItem('weatherFavorites');
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
        let emptyItem = document.createElement('li');
        emptyItem.textContent = '✨ No favorites yet. Add a city above!';
        emptyItem.className = 'empty-message';
        favoritesList.appendChild(emptyItem);
        return;
    }
    
    for (let city of favorites) {
        let listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.addEventListener('click', function() {
            cityInput.value = city;
            getWeatherByCity(city);
        });
        favoritesList.appendChild(listItem);
    }
}

function addCurrentToFavorites() {
    let cityToSave = currentCity;
    
    if (!cityToSave || cityToSave === '--') {
        showUserMessage('Please search for a city first before adding to favorites!');
        return;
    }
    
    let savedFavorites = localStorage.getItem('weatherFavorites');
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    if (favorites.includes(cityToSave)) {
        showUserMessage(`${cityToSave} is already in your favorites!`, false);
        return;
    }
    
    favorites.push(cityToSave);
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
    loadFavorites();
    showUserMessage(`${cityToSave} has been added to your favorites!`, false);
}


function toggleTemperatureUnit() {
    usingCelsius = !usingCelsius;
    
    if (usingCelsius) {
        toggleTempBtn.innerHTML = '🌡️ Switch to Fahrenheit';
    } else {
        toggleTempBtn.innerHTML = '🌡️ Switch to Celsius';
    }
    
    if (currentCity && currentCity !== '--') {
        getWeatherByCity(currentCity);
    }
    
    let lat = latInput.value.trim();
    let lon = lonInput.value.trim();
    if (lat && lon) {
        getForecastByCoordinates(lat, lon);
    }
}


searchCityBtn.addEventListener('click', function() {
    let city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        showUserMessage('Please type a city name!');
    }
});

searchCoordBtn.addEventListener('click', function() {
    let lat = latInput.value.trim();
    let lon = lonInput.value.trim();
    if (lat && lon) {
        getWeatherByCoordinates(lat, lon);
    } else {
        showUserMessage('Please enter both latitude and longitude values!');
    }
});

addFavoriteBtn.addEventListener('click', addCurrentToFavorites);


toggleTempBtn.addEventListener('click', toggleTemperatureUnit);

cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeatherByCity(cityInput.value.trim());
    }
});

latInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchCoordBtn.click();
    }
});

lonInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchCoordBtn.click();
    }
});


loadFavorites();


cityDisplay.innerHTML = ' 📍--';
tempDisplay.innerHTML = '🌡️--';
descDisplay.innerHTML = '🌤️--';
coordDisplay.innerHTML = ' --';
forecastSection.style.display = 'none';

currentCity = '';

cityInput.value = '';
latInput.value = '';
lonInput.value = '';

console.log('✓ Weather app ready - no default data showing');


localStorage.removeItem('weatherFavorites');
localStorage.removeItem('myFavCities');
localStorage.removeItem('favorites');

const favList = document.getElementById('favoritesList');
if (favList) {
    favList.innerHTML = '';
    let emptyMsg = document.createElement('li');
    emptyMsg.textContent = '✨ No favorites yet. Add a city above!';
    emptyMsg.className = 'empty-message';
    favList.appendChild(emptyMsg);
}

const cityDisplayElem = document.getElementById('cityDisplay');
const tempDisplayElem = document.getElementById('tempDisplay');
const descDisplayElem = document.getElementById('descDisplay');
const coordDisplayElem = document.getElementById('coordDisplay');
const forecastSec = document.getElementById('forecastSection');

if (cityDisplayElem) cityDisplayElem.innerHTML = '📍--';
if (tempDisplayElem) tempDisplayElem.innerHTML = '🌡️--';
if (descDisplayElem) descDisplayElem.innerHTML = '🌤️--';
if (coordDisplayElem) coordDisplayElem.innerHTML = ' 🗺️  --';
if (forecastSec) forecastSec.style.display = 'none';

if (document.getElementById('cityName')) document.getElementById('cityName').value = '';
if (document.getElementById('latitude')) document.getElementById('latitude').value = '';
if (document.getElementById('longitude')) document.getElementById('longitude').value = '';

currentCity = '';

console.log('✓ Favorites and weather cleared on refresh');

