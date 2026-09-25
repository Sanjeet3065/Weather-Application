/**
 * AuraSky — Atmospheric Weather Application Core Engine
 * Professional, modern JavaScript with dynamic sky states, local time sync,
 * Apple Weather-style 5-day outlook, 24h hourly forecast, and full persistence.
 */

// --------------------------------------------------------------------------
// 1. Constants & Application State
// --------------------------------------------------------------------------
const WEATHER_API_KEY = 'ad9977ec59bfbd6fd46eecd38378e741';
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const BASE_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const state = {
    unit: localStorage.getItem('aurasky_unit') || 'metric', // 'metric' (°C) or 'imperial' (°F)
    theme: localStorage.getItem('aurasky_theme_v2') || 'light',
    currentWeather: null,
    forecastData: null,
    currentCity: '',
    favorites: JSON.parse(localStorage.getItem('aurasky_favorites') || '["London", "Tokyo", "New York"]'),
    timeClockInterval: null
};

// --------------------------------------------------------------------------
// 2. DOM Elements Cache
// --------------------------------------------------------------------------
const dom = {
    // Header & Controls
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    unitCelsius: document.getElementById('unitCelsius'),
    unitFahrenheit: document.getElementById('unitFahrenheit'),
    openFavoritesBtn: document.getElementById('openFavoritesBtn'),
    favCountBadge: document.getElementById('favCountBadge'),

    // Search Hub
    cityNameInput: document.getElementById('cityNameInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    submitSearchBtn: document.getElementById('submitSearchBtn'),
    geoLocateBtn: document.getElementById('geoLocateBtn'),
    openCoordModalBtn: document.getElementById('openCoordModalBtn'),
    cityChips: document.querySelectorAll('.city-chip'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    weatherDashboard: document.getElementById('weatherDashboard'),

    // Hero Card
    displayCity: document.getElementById('displayCity'),
    displayCountry: document.getElementById('displayCountry'),
    favoriteToggleBtn: document.getElementById('favoriteToggleBtn'),
    localTimeDisplay: document.getElementById('localTimeDisplay'),
    localDateDisplay: document.getElementById('localDateDisplay'),
    currentTempNum: document.getElementById('currentTempNum'),
    tempHighNum: document.getElementById('tempHighNum'),
    tempLowNum: document.getElementById('tempLowNum'),
    feelsLikeNum: document.getElementById('feelsLikeNum'),
    heroWeatherIcon: document.getElementById('heroWeatherIcon'),
    weatherConditionText: document.getElementById('weatherConditionText'),
    coordinatesText: document.getElementById('coordinatesText'),

    // Sun Schedule
    sunTrackerDot: document.getElementById('sunTrackerDot'),
    sunriseTime: document.getElementById('sunriseTime'),
    sunsetTime: document.getElementById('sunsetTime'),
    daylightHours: document.getElementById('daylightHours'),

    // Hourly & 5-Day
    hourlyStrip: document.getElementById('hourlyStrip'),
    fiveDayList: document.getElementById('fiveDayList'),

    // Bento Telemetry
    windSpeed: document.getElementById('windSpeed'),
    windUnit: document.getElementById('windUnit'),
    windDirection: document.getElementById('windDirection'),
    windGust: document.getElementById('windGust'),
    compassNeedle: document.getElementById('compassNeedle'),
    humidityNum: document.getElementById('humidityNum'),
    humidityProgress: document.getElementById('humidityProgress'),
    dewPointText: document.getElementById('dewPointText'),
    pressureNum: document.getElementById('pressureNum'),
    pressureStatus: document.getElementById('pressureStatus'),
    visibilityNum: document.getElementById('visibilityNum'),
    visibilityUnit: document.getElementById('visibilityUnit'),
    visibilityStatus: document.getElementById('visibilityStatus'),
    cloudCoverNum: document.getElementById('cloudCoverNum'),
    cloudProgress: document.getElementById('cloudProgress'),
    cloudStatus: document.getElementById('cloudStatus'),
    comfortTemp: document.getElementById('comfortTemp'),
    comfortVerdict: document.getElementById('comfortVerdict'),

    // Modal
    coordModal: document.getElementById('coordModal'),
    closeCoordModalBtn: document.getElementById('closeCoordModalBtn'),
    cancelCoordBtn: document.getElementById('cancelCoordBtn'),
    applyCoordBtn: document.getElementById('applyCoordBtn'),
    modalLatInput: document.getElementById('modalLatInput'),
    modalLonInput: document.getElementById('modalLonInput'),
    presetPills: document.querySelectorAll('.preset-pill'),

    // Favorites Drawer
    favoritesDrawer: document.getElementById('favoritesDrawer'),
    drawerBackdrop: document.getElementById('drawerBackdrop'),
    closeFavoritesDrawerBtn: document.getElementById('closeFavoritesDrawerBtn'),
    favCardsContainer: document.getElementById('favCardsContainer'),

    // Toast Hub
    toastHub: document.getElementById('toastHub'),
    skyBackground: document.getElementById('skyBackground')
};

// --------------------------------------------------------------------------
// 3. Vector Weather Icon Generator (High-definition SVGs)
// --------------------------------------------------------------------------
function getWeatherSVG(iconCode, isDay = true) {
    // OpenWeatherMap code mapping to clean, artistic SVG vector illustrations
    const code = (iconCode || '').replace('@2x.png', '').trim();
    const day = code.endsWith('d') || isDay;

    switch (code.slice(0, 2)) {
        case '01': // Clear Sky
            if (day) {
                return `
                <svg viewBox="0 0 64 64" fill="none" class="weather-vector-svg">
                    <circle cx="32" cy="32" r="14" fill="#FFB703" filter="drop-shadow(0 0 12px #FB8500)"/>
                    <g stroke="#FB8500" stroke-width="3" stroke-linecap="round">
                        <line x1="32" y1="8" x2="32" y2="12"/>
                        <line x1="32" y1="52" x2="32" y2="56"/>
                        <line x1="8" y1="32" x2="12" y2="32"/>
                        <line x1="52" y1="32" x2="56" y2="32"/>
                        <line x1="15" y1="15" x2="18" y2="18"/>
                        <line x1="46" y1="46" x2="49" y2="49"/>
                        <line x1="15" y1="49" x2="18" y2="46"/>
                        <line x1="46" y1="18" x2="49" y2="15"/>
                    </g>
                </svg>`;
            } else {
                return `
                <svg viewBox="0 0 64 64" fill="none" class="weather-vector-svg">
                    <path d="M42 36A18 18 0 1 1 28 18a14 14 0 0 0 14 18z" fill="#90E0EF" filter="drop-shadow(0 0 10px #00B4D8)"/>
                    <circle cx="48" cy="18" r="1.5" fill="#FFFFFF"/>
                    <circle cx="44" cy="12" r="1" fill="#FFFFFF"/>
                    <circle cx="52" cy="26" r="1.2" fill="#FFFFFF"/>
                </svg>`;
            }

        case '02': // Few Clouds
            return `
            <svg viewBox="0 0 64 64" fill="none" class="weather-vector-svg">
                <circle cx="26" cy="24" r="11" fill="${day ? '#FFB703' : '#90E0EF'}" filter="drop-shadow(0 0 8px ${day ? '#FB8500' : '#00B4D8'})"/>
                <path d="M46 48H22a10 10 0 0 1-2-19.8 14 14 0 0 1 26.5-3.2A9 9 0 0 1 46 48z" fill="#FFFFFF" fill-opacity="0.9" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.15))"/>
            </svg>`;

        case '03': // Scattered Clouds
        case '04': // Broken / Overcast Clouds
            return `
            <svg viewBox="0 0 64 64" fill="none" class="weather-vector-svg">
                <path d="M38 34H18a8 8 0 0 1-1.6-15.8 11 11 0 0 1 20.8-2.6A7 7 0 0 1 38 34z" fill="#94A3B8" fill-opacity="0.7"/>
                <path d="M48 50H22a10 10 0 0 1-2-19.8 14 14 0 0 1 26.5-3.2A9 9 0 0 1 48 50z" fill="#E2E8F0" fill-opacity="0.95" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.2))"/>
            </svg>`;

        case '09': // Shower Rain
        case '10': // Rain
            return `
            <svg viewBox="0 0 64 64" fill="none" class="weather-vector-svg">
                <path d="M46 40H20a9 9 0 0 1-1.8-17.8 13 13 0 0 1 24.6-3A8 8 0 0 1 46 40z" fill="#64748B" fill-opacity="0.9"/>
                <g stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round">
                    <line x1="22" y1="46" x2="19" y2="54"/>
                    <line x1="32" y1="46" x2="29" y2="54"/>
                    <line x1="42" y1="46" x2="39" y2="54"/>
                </g>
            </svg>`;

        case '11': // Thunderstorm
            return `
            <svg viewBox="0 0 64 64" fill="none" class="weather-vector-svg">
                <path d="M46 36H20a9 9 0 0 1-1.8-17.8 13 13 0 0 1 24.6-3A8 8 0 0 1 46 36z" fill="#334155" fill-opacity="0.95"/>
                <polygon points="34 38 26 48 33 48 30 58 40 46 33 46" fill="#FBBF24" filter="drop-shadow(0 0 8px #F59E0B)"/>
            </svg>`;

        case '13': // Snow
            return `
            <svg viewBox="0 0 64 64" fill="none" class="weather-vector-svg">
                <path d="M46 38H20a9 9 0 0 1-1.8-17.8 13 13 0 0 1 24.6-3A8 8 0 0 1 46 38z" fill="#CBD5E1" fill-opacity="0.95"/>
                <g fill="#E0F2FE">
                    <circle cx="22" cy="48" r="2.2"/>
                    <circle cx="32" cy="46" r="2.2"/>
                    <circle cx="42" cy="48" r="2.2"/>
                    <circle cx="27" cy="54" r="2"/>
                    <circle cx="37" cy="54" r="2"/>
                </g>
            </svg>`;

        case '50': // Mist / Fog
        default:
            return `
            <svg viewBox="0 0 64 64" fill="none" class="weather-vector-svg">
                <g stroke="#94A3B8" stroke-width="3" stroke-linecap="round" stroke-dasharray="24 6">
                    <line x1="16" y1="26" x2="48" y2="26"/>
                    <line x1="12" y1="34" x2="52" y2="34"/>
                    <line x1="18" y1="42" x2="46" y2="42"/>
                    <line x1="14" y1="50" x2="50" y2="50"/>
                </g>
            </svg>`;
    }
}

// --------------------------------------------------------------------------
// 4. Utility Functions (Formatting, Calculations)
// --------------------------------------------------------------------------
function formatTemp(tempCelsius) {
    if (tempCelsius === null || tempCelsius === undefined || isNaN(tempCelsius)) return '--';
    if (state.unit === 'metric') {
        return Math.round(tempCelsius);
    } else {
        const fahrenheit = (tempCelsius * 9 / 5) + 32;
        return Math.round(fahrenheit);
    }
}

function getWindUnitLabel() {
    return state.unit === 'metric' ? 'km/h' : 'mph';
}

function formatWindSpeed(speedMps) {
    if (speedMps === null || speedMps === undefined || isNaN(speedMps)) return '--';
    if (state.unit === 'metric') {
        // convert m/s to km/h
        return Math.round(speedMps * 3.6);
    } else {
        // convert m/s to mph
        return Math.round(speedMps * 2.23694);
    }
}

function getWindDirectionText(deg) {
    if (deg === undefined || deg === null) return '--';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return `${directions[index]} (${deg}°)`;
}

function beautifyTitle(text) {
    if (!text) return '';
    return text.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Format city time taking timezone offset into account
function getCityDateInfo(timezoneOffsetSeconds) {
    // Current UTC time
    const nowUtc = Date.now() + (new Date().getTimezoneOffset() * 60000);
    const cityDate = new Date(nowUtc + (timezoneOffsetSeconds * 1000));

    const hours = cityDate.getHours();
    const minutes = cityDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const timeStr = `${formattedHours}:${formattedMinutes} ${ampm}`;

    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateStr = cityDate.toLocaleDateString('en-US', dateOptions);

    return { timeStr, dateStr, cityDate, rawHours: hours };
}

function formatUnixTime(unixTimestamp, timezoneOffsetSeconds) {
    const utc = (unixTimestamp * 1000) + (new Date().getTimezoneOffset() * 60000);
    const date = new Date(utc + (timezoneOffsetSeconds * 1000));
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
}

// --------------------------------------------------------------------------
// 5. Toast Notification System
// --------------------------------------------------------------------------
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-pill toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    dom.toastHub.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(12px) scale(0.95)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// --------------------------------------------------------------------------
// 6. Dynamic Atmosphere & Sky Mood Styling
// --------------------------------------------------------------------------
function updateAtmosphericSky(weatherConditionId, isDay = true) {
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    const orb3 = document.querySelector('.orb-3');

    if (!orb1 || !orb2 || !orb3) return;

    if (state.theme === 'dark') {
        if (!isDay) {
            document.documentElement.style.setProperty('--orb-1-color', 'radial-gradient(circle, rgba(79, 70, 229, 0.45) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-2-color', 'radial-gradient(circle, rgba(14, 165, 233, 0.35) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-3-color', 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)');
            return;
        }

        if (weatherConditionId >= 200 && weatherConditionId < 300) {
            document.documentElement.style.setProperty('--orb-1-color', 'radial-gradient(circle, rgba(109, 40, 217, 0.5) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-2-color', 'radial-gradient(circle, rgba(234, 179, 8, 0.4) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-3-color', 'radial-gradient(circle, rgba(71, 85, 105, 0.5) 0%, transparent 70%)');
        } else if (weatherConditionId >= 300 && weatherConditionId < 600) {
            document.documentElement.style.setProperty('--orb-1-color', 'radial-gradient(circle, rgba(14, 165, 233, 0.45) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-2-color', 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-3-color', 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)');
        } else if (weatherConditionId >= 600 && weatherConditionId < 700) {
            document.documentElement.style.setProperty('--orb-1-color', 'radial-gradient(circle, rgba(224, 242, 254, 0.5) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-2-color', 'radial-gradient(circle, rgba(186, 230, 253, 0.4) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-3-color', 'radial-gradient(circle, rgba(125, 211, 252, 0.35) 0%, transparent 70%)');
        } else if (weatherConditionId === 800) {
            document.documentElement.style.setProperty('--orb-1-color', 'radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-2-color', 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-3-color', 'radial-gradient(circle, rgba(14, 165, 233, 0.35) 0%, transparent 70%)');
        } else {
            document.documentElement.style.setProperty('--orb-1-color', 'radial-gradient(circle, rgba(148, 163, 184, 0.4) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-2-color', 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-3-color', 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)');
        }
    } else {
        // Vibrant Sky Blue Atmosphere (Light Default)
        if (weatherConditionId >= 200 && weatherConditionId < 300) {
            // Thunderstorm
            document.documentElement.style.setProperty('--orb-1-color', 'radial-gradient(circle, rgba(99, 102, 241, 0.55) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-2-color', 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-3-color', 'radial-gradient(circle, rgba(148, 163, 184, 0.5) 0%, transparent 70%)');
        } else if (weatherConditionId >= 300 && weatherConditionId < 600) {
            // Rain / Drizzle
            document.documentElement.style.setProperty('--orb-1-color', 'radial-gradient(circle, rgba(14, 165, 233, 0.65) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-2-color', 'radial-gradient(circle, rgba(56, 189, 248, 0.6) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-3-color', 'radial-gradient(circle, rgba(125, 211, 252, 0.45) 0%, transparent 70%)');
        } else if (weatherConditionId >= 600 && weatherConditionId < 700) {
            // Snow
            document.documentElement.style.setProperty('--orb-1-color', 'radial-gradient(circle, rgba(186, 230, 253, 0.75) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-2-color', 'radial-gradient(circle, rgba(224, 242, 254, 0.8) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-3-color', 'radial-gradient(circle, rgba(125, 211, 252, 0.55) 0%, transparent 70%)');
        } else if (weatherConditionId === 800) {
            // Clear Sunny Sky
            document.documentElement.style.setProperty('--orb-1-color', 'radial-gradient(circle, rgba(56, 189, 248, 0.75) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-2-color', 'radial-gradient(circle, rgba(14, 165, 233, 0.6) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-3-color', 'radial-gradient(circle, rgba(253, 224, 71, 0.45) 0%, transparent 70%)');
        } else {
            // Clouds / Mist
            document.documentElement.style.setProperty('--orb-1-color', 'radial-gradient(circle, rgba(56, 189, 248, 0.6) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-2-color', 'radial-gradient(circle, rgba(186, 230, 253, 0.65) 0%, transparent 70%)');
            document.documentElement.style.setProperty('--orb-3-color', 'radial-gradient(circle, rgba(148, 163, 184, 0.4) 0%, transparent 70%)');
        }
    }
}

// --------------------------------------------------------------------------
// 7. API Fetching Engines
// --------------------------------------------------------------------------
async function fetchWeatherByCity(cityName) {
    if (!cityName || !cityName.trim()) {
        showToast('Please enter a city name to search', 'error');
        return;
    }

    setLoading(true);
    try {
        const weatherUrl = `${BASE_WEATHER_URL}?q=${encodeURIComponent(cityName.trim())}&appid=${WEATHER_API_KEY}&units=metric`;
        const weatherRes = await fetch(weatherUrl);

        if (!weatherRes.ok) {
            if (weatherRes.status === 404) {
                showToast(`City "${cityName}" not found. Please check spelling!`, 'error');
            } else {
                showToast('Unable to fetch weather data. Please try again.', 'error');
            }
            setLoading(false);
            return;
        }

        const weatherData = await weatherRes.json();
        state.currentWeather = weatherData;
        state.currentCity = weatherData.name;

        // Fetch companion forecast
        await fetchForecastByCoordinates(weatherData.coord.lat, weatherData.coord.lon);
        renderCompleteDashboard();
        showToast(`Loaded live weather for ${weatherData.name}`, 'success');

    } catch (err) {
        console.error('City weather fetch failed:', err);
        showToast('Network error. Check your internet connection.', 'error');
    } finally {
        setLoading(false);
    }
}

async function fetchWeatherByCoordinates(lat, lon) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
        showToast('Please enter valid coordinates (-90 to +90 lat, -180 to +180 lon)', 'error');
        return;
    }

    setLoading(true);
    try {
        const weatherUrl = `${BASE_WEATHER_URL}?lat=${latNum}&lon=${lonNum}&appid=${WEATHER_API_KEY}&units=metric`;
        const weatherRes = await fetch(weatherUrl);

        if (!weatherRes.ok) {
            showToast('Unable to locate weather for those coordinates.', 'error');
            setLoading(false);
            return;
        }

        const weatherData = await weatherRes.json();
        state.currentWeather = weatherData;
        state.currentCity = weatherData.name || `Coord (${latNum.toFixed(2)}, ${lonNum.toFixed(2)})`;

        await fetchForecastByCoordinates(latNum, lonNum);
        renderCompleteDashboard();
        showToast(`Loaded weather for ${state.currentCity}`, 'success');

    } catch (err) {
        console.error('Coordinate weather fetch failed:', err);
        showToast('Network error. Check your connection.', 'error');
    } finally {
        setLoading(false);
    }
}

async function fetchForecastByCoordinates(lat, lon) {
    try {
        const forecastUrl = `${BASE_FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
        const res = await fetch(forecastUrl);
        if (res.ok) {
            state.forecastData = await res.json();
        }
    } catch (err) {
        console.error('Forecast fetch failed:', err);
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        dom.loadingIndicator.style.display = 'flex';
        dom.submitSearchBtn.style.opacity = '0.5';
        dom.submitSearchBtn.style.pointerEvents = 'none';
    } else {
        dom.loadingIndicator.style.display = 'none';
        dom.submitSearchBtn.style.opacity = '1';
        dom.submitSearchBtn.style.pointerEvents = 'auto';
    }
}

// --------------------------------------------------------------------------
// 8. Render Engine: Hero Weather & Sun Cycle
// --------------------------------------------------------------------------
function renderHeroCard() {
    const data = state.currentWeather;
    if (!data) return;

    // City & Country
    dom.displayCity.textContent = data.name || 'Unknown Location';
    dom.displayCountry.textContent = data.sys && data.sys.country ? data.sys.country : '';

    // Coordinates telemetry
    if (data.coord) {
        dom.coordinatesText.innerHTML = `
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>
            <span>Lat: ${data.coord.lat.toFixed(4)}° • Lon: ${data.coord.lon.toFixed(4)}°</span>
        `;
    }

    // Temperature & Badges
    dom.currentTempNum.textContent = formatTemp(data.main.temp);
    dom.tempHighNum.textContent = `${formatTemp(data.main.temp_max)}°`;
    dom.tempLowNum.textContent = `${formatTemp(data.main.temp_min)}°`;
    dom.feelsLikeNum.textContent = `${formatTemp(data.main.feels_like)}°`;

    // Weather condition text
    const condition = data.weather && data.weather[0] ? data.weather[0] : { description: 'Clear', icon: '01d', id: 800 };
    dom.weatherConditionText.textContent = beautifyTitle(condition.description);

    // Weather Icon & Atmosphere
    const isDayTime = condition.icon.endsWith('d');
    dom.heroWeatherIcon.innerHTML = getWeatherSVG(condition.icon, isDayTime);
    updateAtmosphericSky(condition.id, isDayTime);

    // Live Local Time sync
    if (state.timeClockInterval) clearInterval(state.timeClockInterval);
    const updateTimeDisplay = () => {
        const dateInfo = getCityDateInfo(data.timezone);
        dom.localTimeDisplay.textContent = `Local Time: ${dateInfo.timeStr}`;
        dom.localDateDisplay.textContent = dateInfo.dateStr;
    };
    updateTimeDisplay();
    state.timeClockInterval = setInterval(updateTimeDisplay, 1000);

    // Check favorite button state
    updateHeroFavoriteButton();
}

function renderSunCycle() {
    const data = state.currentWeather;
    if (!data || !data.sys || !data.sys.sunrise || !data.sys.sunset) return;

    const sunriseStr = formatUnixTime(data.sys.sunrise, data.timezone);
    const sunsetStr = formatUnixTime(data.sys.sunset, data.timezone);

    dom.sunriseTime.textContent = sunriseStr;
    dom.sunsetTime.textContent = sunsetStr;

    // Daylight duration
    const durationSeconds = data.sys.sunset - data.sys.sunrise;
    const durationHours = Math.floor(durationSeconds / 3600);
    const durationMinutes = Math.floor((durationSeconds % 3600) / 60);
    dom.daylightHours.textContent = `${durationHours}h ${durationMinutes}m`;

    // Calculate current sun position relative to sunrise and sunset
    const nowUtc = Math.floor(Date.now() / 1000);
    let sunProgress = (nowUtc - data.sys.sunrise) / (data.sys.sunset - data.sys.sunrise);
    sunProgress = Math.max(0, Math.min(1, sunProgress));

    // Place sun tracker dot along arc (angle 0 to 180 degrees)
    const angleRad = Math.PI * sunProgress;
    // Map to percentage position (0% left to 100% right)
    const leftPercent = 10 + (sunProgress * 80);
    const topPercent = 90 - (Math.sin(angleRad) * 75);

    dom.sunTrackerDot.style.left = `${leftPercent}%`;
    dom.sunTrackerDot.style.top = `${topPercent}%`;

    if (nowUtc < data.sys.sunrise || nowUtc > data.sys.sunset) {
        dom.sunTrackerDot.style.opacity = '0.35';
        dom.sunTrackerDot.style.boxShadow = '0 0 10px #90e0ef';
    } else {
        dom.sunTrackerDot.style.opacity = '1';
        dom.sunTrackerDot.style.boxShadow = '0 0 18px #fb8500, 0 0 4px #fff';
    }
}

// --------------------------------------------------------------------------
// 9. Render Engine: 24-Hour Hourly Outlook Strip
// --------------------------------------------------------------------------
function renderHourlyForecast() {
    if (!state.forecastData || !state.forecastData.list) return;

    const hourlyList = state.forecastData.list.slice(0, 8); // Next 24 hours (8 * 3h)
    dom.hourlyStrip.innerHTML = '';

    hourlyList.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `hourly-card ${index === 0 ? 'active-now' : ''}`;

        let timeLabel;
        if (index === 0) {
            timeLabel = 'Now';
        } else {
            const timeObj = getCityDateInfo(state.currentWeather ? state.currentWeather.timezone : 0);
            const itemDate = new Date(item.dt_txt);
            let h = itemDate.getHours();
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            timeLabel = `${h} ${ampm}`;
        }

        const iconCode = item.weather[0].icon;
        const iconSvg = getWeatherSVG(iconCode, iconCode.endsWith('d'));
        const tempFormatted = `${formatTemp(item.main.temp)}°`;

        // Rain probability if available
        const pop = Math.round((item.pop || 0) * 100);
        const popBadge = pop > 0 ? `<span class="hourly-precip">💧 ${pop}%</span>` : '';

        card.innerHTML = `
            <span class="hourly-time">${timeLabel}</span>
            <div class="hourly-icon">${iconSvg}</div>
            <span class="hourly-temp">${tempFormatted}</span>
            ${popBadge}
        `;

        dom.hourlyStrip.appendChild(card);
    });
}

// --------------------------------------------------------------------------
// 10. Render Engine: Apple-Weather Style 5-Day Outlook with Dynamic Bars
// --------------------------------------------------------------------------
function renderFiveDayForecast() {
    if (!state.forecastData || !state.forecastData.list) return;

    // Group items by calendar day
    const daysMap = new Map();

    state.forecastData.list.forEach(item => {
        const dateKey = item.dt_txt.split(' ')[0];
        if (!daysMap.has(dateKey)) {
            daysMap.set(dateKey, []);
        }
        daysMap.get(dateKey).push(item);
    });

    const dailySummaries = [];
    daysMap.forEach((items, dateStr) => {
        let min = Infinity;
        let max = -Infinity;
        let middayItem = items[Math.floor(items.length / 2)];

        items.forEach(it => {
            if (it.main.temp_min < min) min = it.main.temp_min;
            if (it.main.temp_max > max) max = it.main.temp_max;
        });

        dailySummaries.push({
            dateStr,
            min,
            max,
            icon: middayItem.weather[0].icon,
            desc: middayItem.weather[0].description
        });
    });

    // We take the first 5 unique days
    const fiveDays = dailySummaries.slice(0, 5);

    // Compute absolute lowest and highest temp across the entire 5-day span
    let globalMin = Math.min(...fiveDays.map(d => d.min));
    let globalMax = Math.max(...fiveDays.map(d => d.max));
    const range = Math.max(1, globalMax - globalMin);

    dom.fiveDayList.innerHTML = '';

    fiveDays.forEach((day, index) => {
        const dateObj = new Date(day.dateStr);
        let dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const isToday = index === 0;
        if (isToday) dayName = 'Today';
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const conditionText = beautifyTitle(day.desc);

        const leftPercent = ((day.min - globalMin) / range) * 100;
        const widthPercent = Math.max(12, ((day.max - day.min) / range) * 100);

        const row = document.createElement('div');
        row.className = 'fiveday-item';
        row.innerHTML = `
            <div class="fiveday-col-meta">
                <div class="fiveday-day-row">
                    <span class="fiveday-day ${isToday ? 'is-today' : ''}">${dayName}</span>
                    <span class="fiveday-date">${formattedDate}</span>
                </div>
                <div class="fiveday-condition-tag" title="${conditionText}">
                    <span class="condition-dot"></span>
                    <span class="condition-name">${conditionText}</span>
                </div>
            </div>
            <div class="fiveday-col-weather">
                <div class="fiveday-icon">${getWeatherSVG(day.icon, true)}</div>
            </div>
            <div class="fiveday-col-temp">
                <span class="fiveday-temp-low">${formatTemp(day.min)}°</span>
                <div class="temp-bar-track">
                    <div class="temp-bar-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
                </div>
                <span class="fiveday-temp-high">${formatTemp(day.max)}°</span>
            </div>
        `;

        dom.fiveDayList.appendChild(row);
    });
}

// --------------------------------------------------------------------------
// 11. Render Engine: Bento Grid Comprehensive Metrics
// --------------------------------------------------------------------------
function renderBentoMetrics() {
    const data = state.currentWeather;
    if (!data) return;

    // 1. Wind
    const speed = data.wind ? data.wind.speed : 0;
    dom.windSpeed.textContent = formatWindSpeed(speed);
    dom.windUnit.textContent = getWindUnitLabel();
    const deg = data.wind ? data.wind.deg : 0;
    dom.windDirection.textContent = `Dir: ${getWindDirectionText(deg)}`;
    dom.compassNeedle.style.transform = `rotate(${deg}deg)`;

    const gust = data.wind && data.wind.gust ? formatWindSpeed(data.wind.gust) : null;
    dom.windGust.textContent = gust ? `Gusts: ${gust} ${getWindUnitLabel()}` : 'Steady breeze';

    // 2. Humidity
    const humidity = data.main ? data.main.humidity : 0;
    dom.humidityNum.textContent = humidity;
    dom.humidityProgress.style.width = `${humidity}%`;

    if (humidity < 35) {
        dom.dewPointText.textContent = 'Air is currently dry';
    } else if (humidity <= 65) {
        dom.dewPointText.textContent = 'Comfortable moisture level';
    } else {
        dom.dewPointText.textContent = 'High relative humidity';
    }

    // 3. Pressure
    const pressure = data.main ? data.main.pressure : 1013;
    dom.pressureNum.textContent = pressure;
    if (pressure > 1020) {
        dom.pressureStatus.textContent = 'High pressure system (Fair weather)';
    } else if (pressure < 1005) {
        dom.pressureStatus.textContent = 'Low pressure system (Unsettled)';
    } else {
        dom.pressureStatus.textContent = 'Standard barometric pressure';
    }

    // 4. Visibility
    const rawVis = data.visibility !== undefined ? data.visibility : 10000;
    if (state.unit === 'metric') {
        const km = (rawVis / 1000).toFixed(1);
        dom.visibilityNum.textContent = km;
        dom.visibilityUnit.textContent = 'km';
    } else {
        const miles = (rawVis / 1609.34).toFixed(1);
        dom.visibilityNum.textContent = miles;
        dom.visibilityUnit.textContent = 'mi';
    }

    if (rawVis >= 10000) {
        dom.visibilityStatus.textContent = 'Perfect crystal visibility';
    } else if (rawVis >= 5000) {
        dom.visibilityStatus.textContent = 'Moderate atmospheric haze';
    } else {
        dom.visibilityStatus.textContent = 'Dense fog or precipitation';
    }

    // 5. Cloud Cover
    const clouds = data.clouds ? data.clouds.all : 0;
    dom.cloudCoverNum.textContent = clouds;
    dom.cloudProgress.style.width = `${clouds}%`;

    if (clouds <= 10) {
        dom.cloudStatus.textContent = 'Clear open skies';
    } else if (clouds <= 50) {
        dom.cloudStatus.textContent = 'Partly scattered clouds';
    } else {
        dom.cloudStatus.textContent = 'Heavy overcast cloud blanket';
    }

    // 6. Thermal Comfort
    const temp = data.main.temp;
    const feels = data.main.feels_like;
    dom.comfortTemp.textContent = formatTemp(feels);

    const diff = Math.round(feels - temp);
    if (diff === 0) {
        dom.comfortVerdict.textContent = 'Perception matches actual temp';
    } else if (diff > 0) {
        dom.comfortVerdict.textContent = `Feels ${diff}° warmer due to humidity`;
    } else {
        dom.comfortVerdict.textContent = `Feels ${Math.abs(diff)}° cooler due to wind chill`;
    }
}

// Master Render Trigger
function renderCompleteDashboard() {
    renderHeroCard();
    renderSunCycle();
    renderHourlyForecast();
    renderFiveDayForecast();
    renderBentoMetrics();
}

// --------------------------------------------------------------------------
// 12. Unit Switcher (°C <-> °F)
// --------------------------------------------------------------------------
function setUnit(newUnit) {
    if (state.unit === newUnit) return;
    state.unit = newUnit;
    localStorage.setItem('aurasky_unit', newUnit);

    if (newUnit === 'metric') {
        dom.unitCelsius.classList.add('active');
        dom.unitFahrenheit.classList.remove('active');
    } else {
        dom.unitFahrenheit.classList.add('active');
        dom.unitCelsius.classList.remove('active');
    }

    // Reactive re-render with new units
    if (state.currentWeather) {
        renderCompleteDashboard();
    }
    showToast(`Switched unit to °${newUnit === 'metric' ? 'C' : 'F'}`, 'info');
}

// --------------------------------------------------------------------------
// 13. Light / Dark Theme Management
// --------------------------------------------------------------------------
function initTheme() {
    // If previous session had dark cached, reset to default 'light' (Sky Blue)
    if (localStorage.getItem('aurasky_theme') === 'dark' && !localStorage.getItem('aurasky_theme_v2')) {
        state.theme = 'light';
        localStorage.setItem('aurasky_theme_v2', 'light');
        localStorage.setItem('aurasky_theme', 'light');
    }
    document.documentElement.setAttribute('data-theme', state.theme);
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('aurasky_theme_v2', state.theme);
    localStorage.setItem('aurasky_theme', state.theme);

    // Update atmospheric sky colors
    if (state.currentWeather && state.currentWeather.weather && state.currentWeather.weather[0]) {
        const cond = state.currentWeather.weather[0];
        updateAtmosphericSky(cond.id, cond.icon.endsWith('d'));
    }
    showToast(`${state.theme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated`, 'info');
}

// --------------------------------------------------------------------------
// 14. Favorites & Saved Locations Management
// --------------------------------------------------------------------------
function updateFavoritesCount() {
    const count = state.favorites.length;
    if (count > 0) {
        dom.favCountBadge.textContent = count;
        dom.favCountBadge.style.display = 'flex';
    } else {
        dom.favCountBadge.style.display = 'none';
    }
}

function updateHeroFavoriteButton() {
    if (!state.currentCity) return;
    const isSaved = state.favorites.some(c => c.toLowerCase() === state.currentCity.toLowerCase());

    if (isSaved) {
        dom.favoriteToggleBtn.classList.add('is-favorite');
        dom.favoriteToggleBtn.querySelector('.fav-text-label').textContent = 'Saved City';
    } else {
        dom.favoriteToggleBtn.classList.remove('is-favorite');
        dom.favoriteToggleBtn.querySelector('.fav-text-label').textContent = 'Save City';
    }
}

function toggleCurrentCityFavorite() {
    if (!state.currentCity) {
        showToast('Search for a city first before saving', 'error');
        return;
    }

    const index = state.favorites.findIndex(c => c.toLowerCase() === state.currentCity.toLowerCase());

    if (index >= 0) {
        // Remove
        state.favorites.splice(index, 1);
        showToast(`Removed ${state.currentCity} from saved locations`, 'info');
    } else {
        // Add
        state.favorites.push(state.currentCity);
        showToast(`Added ${state.currentCity} to saved locations`, 'success');
    }

    localStorage.setItem('aurasky_favorites', JSON.stringify(state.favorites));
    updateFavoritesCount();
    updateHeroFavoriteButton();
    renderFavoritesDrawer();
}

function renderFavoritesDrawer() {
    dom.favCardsContainer.innerHTML = '';

    if (state.favorites.length === 0) {
        dom.favCardsContainer.innerHTML = `
            <div class="empty-favs-state">
                <span>⭐</span>
                <p>No saved cities yet. Click "Save City" on any forecast to quickly track it here!</p>
            </div>
        `;
        return;
    }

    state.favorites.forEach(city => {
        const card = document.createElement('div');
        card.className = 'fav-city-card';
        card.innerHTML = `
            <div class="fav-city-info">
                <div class="fav-city-name">${city}</div>
                <div class="fav-city-badge">Tap to inspect</div>
            </div>
            <button class="fav-delete-btn" data-city="${city}" title="Remove city">✕</button>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.fav-delete-btn')) {
                const targetCity = e.target.closest('.fav-delete-btn').dataset.city;
                removeFavoriteCity(targetCity);
                return;
            }
            closeFavoritesDrawer();
            fetchWeatherByCity(city);
        });

        dom.favCardsContainer.appendChild(card);
    });
}

function removeFavoriteCity(cityName) {
    state.favorites = state.favorites.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    localStorage.setItem('aurasky_favorites', JSON.stringify(state.favorites));
    updateFavoritesCount();
    updateHeroFavoriteButton();
    renderFavoritesDrawer();
    showToast(`Removed ${cityName}`, 'info');
}

function openFavoritesDrawer() {
    renderFavoritesDrawer();
    dom.favoritesDrawer.classList.add('open');
    dom.drawerBackdrop.classList.add('active');
}

function closeFavoritesDrawer() {
    dom.favoritesDrawer.classList.remove('open');
    dom.drawerBackdrop.classList.remove('active');
}

// --------------------------------------------------------------------------
// 15. Coordinates Modal Controls
// --------------------------------------------------------------------------
function openCoordinatesModal() {
    dom.coordModal.showModal();
}

function closeCoordinatesModal() {
    dom.coordModal.close();
}

// --------------------------------------------------------------------------
// 16. Geolocation (One-Click GPS Auto-Detect)
// --------------------------------------------------------------------------
function requestCurrentGPSLocation() {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser', 'error');
        return;
    }

    showToast('Acquiring precision GPS telemetry...', 'info');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
            console.warn('Geolocation error:', error);
            if (error.code === error.PERMISSION_DENIED) {
                showToast('Location permission denied. Please search city manually.', 'error');
            } else {
                showToast('Could not acquire location coordinates.', 'error');
            }
        },
        { timeout: 10000, enableHighAccuracy: true }
    );
}

// --------------------------------------------------------------------------
// 17. Event Listeners Binding
// --------------------------------------------------------------------------
function setupEventListeners() {
    // Theme toggle
    dom.themeToggleBtn.addEventListener('click', toggleTheme);

    // Units toggle
    dom.unitCelsius.addEventListener('click', () => setUnit('metric'));
    dom.unitFahrenheit.addEventListener('click', () => setUnit('imperial'));

    // Search input & button
    dom.submitSearchBtn.addEventListener('click', () => {
        const query = dom.cityNameInput.value.trim();
        if (query) fetchWeatherByCity(query);
    });

    dom.cityNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = dom.cityNameInput.value.trim();
            if (query) fetchWeatherByCity(query);
        }
    });

    dom.cityNameInput.addEventListener('input', () => {
        dom.clearSearchBtn.style.display = dom.cityNameInput.value.trim() ? 'flex' : 'none';
    });

    dom.clearSearchBtn.addEventListener('click', () => {
        dom.cityNameInput.value = '';
        dom.clearSearchBtn.style.display = 'none';
        dom.cityNameInput.focus();
    });

    // Popular city shortcut chips
    dom.cityChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const city = chip.dataset.city;
            dom.cityNameInput.value = city;
            fetchWeatherByCity(city);
        });
    });

    // Geolocation trigger
    dom.geoLocateBtn.addEventListener('click', requestCurrentGPSLocation);

    // Coordinates Modal Triggers
    dom.openCoordModalBtn.addEventListener('click', openCoordinatesModal);
    dom.closeCoordModalBtn.addEventListener('click', closeCoordinatesModal);
    dom.cancelCoordBtn.addEventListener('click', closeCoordinatesModal);

    dom.presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            dom.modalLatInput.value = pill.dataset.lat;
            dom.modalLonInput.value = pill.dataset.lon;
        });
    });

    dom.applyCoordBtn.addEventListener('click', () => {
        const lat = dom.modalLatInput.value.trim();
        const lon = dom.modalLonInput.value.trim();
        if (lat && lon) {
            closeCoordinatesModal();
            fetchWeatherByCoordinates(lat, lon);
        } else {
            showToast('Please fill in both latitude and longitude', 'error');
        }
    });

    // Favorites Drawer & Toggle
    dom.openFavoritesBtn.addEventListener('click', openFavoritesDrawer);
    dom.closeFavoritesDrawerBtn.addEventListener('click', closeFavoritesDrawer);
    dom.drawerBackdrop.addEventListener('click', closeFavoritesDrawer);
    dom.favoriteToggleBtn.addEventListener('click', toggleCurrentCityFavorite);

    // Close modal on outside click
    dom.coordModal.addEventListener('click', (e) => {
        const rect = dom.coordModal.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
            && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            closeCoordinatesModal();
        }
    });
}

// --------------------------------------------------------------------------
// 18. Application Initializer
// --------------------------------------------------------------------------
function initApp() {
    initTheme();
    updateFavoritesCount();
    setupEventListeners();

    // Configure initial unit button state
    if (state.unit === 'metric') {
        dom.unitCelsius.classList.add('active');
        dom.unitFahrenheit.classList.remove('active');
    } else {
        dom.unitFahrenheit.classList.add('active');
        dom.unitCelsius.classList.remove('active');
    }

    // Load initial city (saved favorite or default aesthetic hub)
    const initialCity = state.favorites.length > 0 ? state.favorites[0] : 'New Delhi';
    fetchWeatherByCity(initialCity);
}

// Kickstart on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
