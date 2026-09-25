# AuraSky — Premium Atmospheric Weather Application 🌤️

A cutting-edge, human-crafted Weather Web Application built purely with **Vanilla HTML5, CSS3, and JavaScript**. AuraSky blends atmospheric sky-blur aesthetics, Apple Weather-style visuals, and fluid Bento Grid telemetry to deliver an immersive weather experience across mobile, tablet, and desktop devices.

---

## ✨ Key Features & Highlights

- **🌌 Atmospheric Sky Blur & Dynamic Aurora**: Floating glowing orbs with frosted glassmorphism (`backdrop-filter: blur(28px)`), dynamically shifting ambient light based on current weather conditions (sunny, rainy, thunderstorm, snow, cloudy, or night).
- **🌓 Light & Dark Modes**: Seamless theme switching with smooth transitions and persistent state stored in `localStorage`.
- **🌡️ Live Units Switcher**: Toggle instantly between Celsius (°C) and Fahrenheit (°F) across all telemetry and forecast cards.
- **🕒 Real-Time Local City Time**: Synchronized clock calculating the city's exact local time and date based on its UTC timezone offset.
- **🛰️ Smart Search Hub**:
  - Instant city/region search with auto-clear and keyboard shortcuts.
  - One-click **My Location** button leveraging browser GPS Geolocation.
  - Quick-pick **Popular City Chips** (New Delhi, London, Tokyo, New York, Dubai, Paris, Sydney).
  - Dedicated **Precision Coordinates Modal** with validation and quick geographic landmark presets.
- **☀️ Sun Schedule & Solar Arc**: Visual curve tracing the live position of the sun between sunrise and sunset, displaying total daylight hours.
- **⏱️ 24-Hour Hourly Forecast Strip**: Horizontal scrolling strip with custom vector weather icons, temperatures, and rain probability indicators.
- **📅 Apple-Style 5-Day Outlook**: Daily weather summaries featuring dynamic relative temperature gradient bars (min/max range).
- **📊 Detailed Bento Telemetry**:
  - **Wind**: Speed (km/h or mph), rotating compass needle pointing in real degrees, and gust speeds.
  - **Humidity**: Percentage progress bar and dew point comfort indicators.
  - **Barometric Pressure**: Atmospheric pressure in hPa with high/low system classifications.
  - **Visibility**: Accurate distance in km or miles.
  - **Cloud Coverage**: Overcast percentage and sky condition status.
  - **Thermal Comfort**: "Feels like" comparison explaining the perceived difference.
- **⭐ Saved Locations Drawer**: Slide-over drawer to save, view, and manage your favorite cities with 1-click weather inspection.
- **🔔 Custom Floating Toast Hub**: Modern, unobtrusive status toasts instead of intrusive browser `alert()` popups.
- **📱 100% Responsive Design**: Pixel-perfect layout tailored for mobile phones, tablets, laptops, and ultra-wide displays.

---

## 🚀 How to Run Locally

You can open the project in any modern web browser directly:

1. Double click `index.html` to open it in your browser.
2. Or run a local development server using Python:
   ```bash
   python -m http.server 3000
   ```
   and visit `http://localhost:3000` in your browser.

---

## 🛠️ Technology Stack
- **HTML5**: Semantic, accessible markup.
- **Vanilla CSS3**: Design tokens, frosted glassmorphism, fluid bento grids, and keyframe animations.
- **Vanilla JavaScript (ES6+)**: Asynchronous API telemetry, dynamic SVG generation, and state management.
- **Weather API**: Powered by OpenWeatherMap API.
