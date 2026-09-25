# WeatherSphere 🌤️

A modern, responsive weather forecast application built purely with **Vanilla HTML5, CSS3, and JavaScript**. Features an atmospheric sky blur design, real-time weather telemetry, 24-hour hourly predictions, and a comprehensive 5-day outlook.

🔗 **Live Demo**: [https://sanjeet3065.github.io/Weather-Application/](https://sanjeet3065.github.io/Weather-Application/)

---

## 📸 Overview

WeatherSphere delivers hyper-local weather insights with a clean, glassmorphic Bento Grid interface. It adapts its sky ambiance dynamically based on live conditions and daylight cycles, offering a fast, lightweight, and framework-free user experience.

---

## ✨ Features

- **Real-Time Weather Metrics**: Live temperature, high/low spread, perceived "feels like" temperature, and weather condition badges.
- **5-Day Extended Forecast**: Daily condition summaries (rain, clouds, clear sky, etc.) with visual min-to-max temperature range bars.
- **24-Hour Hourly Outlook**: Smooth horizontal scroll showcasing 3-hour temperature intervals and precipitation probabilities.
- **Detailed Bento Telemetry**:
  - **Wind**: Speed (km/h or mph), rotating compass needle with cardinal direction, and wind gusts.
  - **Humidity**: Relative humidity percentage and dew point comfort indicators.
  - **Barometric Pressure**: Atmospheric pressure in hPa with high/low system identification.
  - **Visibility**: Clear distance metrics in kilometers or miles.
  - **Cloud Coverage**: Overcast percentages.
  - **Thermal Comfort**: Perceived thermal differential based on wind chill and humidity.
- **Sun Schedule**: Solar arc curve tracing the live position of the sun between sunrise and sunset, including total daylight hours.
- **Multi-Mode Location Search**:
  - Global city and region search with instant results.
  - One-click **My Location** button powered by browser GPS geolocation.
  - Precision **Coordinates Finder** with latitude/longitude inputs and landmark presets.
  - Quick-pick popular city chips (London, Tokyo, New Delhi, New York, etc.).
- **Theme Modes**: Default **Sky Blue (Light)** atmospheric mode with a toggle for **Celestial Midnight (Dark)** mode (saved in `localStorage`).
- **Unit Conversion**: Seamless one-tap toggle between Celsius (°C) and Fahrenheit (°F).
- **Saved Locations**: Slide-over drawer to bookmark and monitor favorite cities across the globe.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic and accessible markup.
- **Vanilla CSS3**: Custom design tokens, frosted glassmorphism (`backdrop-filter`), dynamic sky gradients, and fluid responsive grid.
- **Vanilla JavaScript (ES6+)**: Fetch API, real-time timezone calculations, vector SVG icon generation, and state persistence.
- **API**: Powered by [OpenWeatherMap](https://openweathermap.org/).

---

## 🚀 Getting Started

No build tools, bundlers, or package managers required.

### 1. Clone the repository
```bash
git clone https://github.com/Sanjeet3065/Weather-Application.git
```

### 2. Run Locally
Open `index.html` directly in your web browser, or launch a local server:

```bash
# Using Python
python -m http.server 3000

# Or using Node.js / npx
npx serve .
```

Visit `http://localhost:3000` in your browser.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
