import { CONFIG, WEEKDAYS } from "./config";
import { weatherIcon } from "./weather-icons";

const WMO_DESC: Record<number, string> = {
  0: "快晴", 1: "晴れ", 2: "曇りがち", 3: "曇り",
  45: "霧", 48: "濃霧",
  51: "小雨", 53: "小雨", 55: "小雨",
  56: "凍雨", 57: "凍雨",
  61: "小雨", 63: "雨", 65: "大雨",
  66: "凍雨", 67: "大凍雨",
  71: "小雪", 73: "雪", 75: "大雪", 77: "あられ",
  80: "にわか雨", 81: "にわか雨", 82: "豪雨",
  85: "にわか雪", 86: "大雪",
  95: "雷雨", 96: "雷雨・雹", 99: "雷雨・大雹",
};

function getDesc(code: number): string {
  return WMO_DESC[code] || "--";
}

interface WeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
  };
}

let weatherData: WeatherResponse | null = null;
let lastFetch = 0;

function showError(msg: string): void {
  const el = document.getElementById("weather-loading");
  if (el) el.textContent = msg;
}

function render(): void {
  if (!weatherData) return;

  const section = document.getElementById("weather-section");
  if (!section) return;

  const cur = weatherData.current;
  const daily = weatherData.daily;
  const now = new Date();

  const locationEl = document.getElementById("weather-location");
  if (locationEl) locationEl.textContent = CONFIG.locationName;

  const headerHtml = section.querySelector(".weather-header")?.outerHTML || "";
  let html = headerHtml;

  // Current
  html += `<div class="weather-current">
    <div class="weather-icon-large">${weatherIcon(cur.weather_code, 80)}</div>
    <div>
      <div class="weather-temp-main">${Math.round(cur.temperature_2m)}<span class="unit">\u00B0C</span></div>
      <div class="weather-condition">${getDesc(cur.weather_code)}</div>
      <div class="weather-details">
        <div class="weather-detail-item">湿度 <span class="val">${cur.relative_humidity_2m}%</span></div>
        <div class="weather-detail-item">風速 <span class="val">${Math.round(cur.wind_speed_10m)}km/h</span></div>
      </div>
    </div>
  </div>`;

  // 7-day forecast
  html += '<div class="weather-forecast">';
  for (let i = 0; i < 7 && i < daily.time.length; i++) {
    const [y, m, d] = daily.time[i].split("-").map(Number);
    const dDate = new Date(y, m - 1, d);
    const ddow = dDate.getDay();
    const isToday =
      dDate.getFullYear() === now.getFullYear() &&
      dDate.getMonth() === now.getMonth() &&
      dDate.getDate() === now.getDate();
    const dowClass =
      "f-weekday" + (ddow === 0 ? " sun" : "") + (ddow === 6 ? " sat" : "");

    html += `<div class="forecast-day${isToday ? " today-forecast" : ""}">
      <div class="${dowClass}">${WEEKDAYS[ddow]}</div>
      <div class="f-date">${dDate.getMonth() + 1}/${dDate.getDate()}</div>
      <div class="f-icon">${weatherIcon(daily.weather_code[i], 36)}</div>
      <div class="f-temp"><span class="hi">${Math.round(daily.temperature_2m_max[i])}</span> / <span class="lo">${Math.round(daily.temperature_2m_min[i])}</span></div>
      ${daily.precipitation_probability_max[i] != null ? `<div class="f-precip">${daily.precipitation_probability_max[i]}%</div>` : ""}
    </div>`;
  }
  html += "</div>";

  section.innerHTML = html;
}

export function fetchWeather(): void {
  const url =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${CONFIG.lat}&longitude=${CONFIG.lon}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=Asia%2FTokyo&forecast_days=7`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          weatherData = JSON.parse(xhr.responseText);
          lastFetch = Date.now();
          render();
        } catch {
          showError("天気情報の解析に失敗");
        }
      } else {
        showError("天気情報の取得に失敗");
      }
    }
  };
  xhr.send();
}

export function shouldRefreshWeather(): boolean {
  return Date.now() - lastFetch > CONFIG.weatherRefreshMinutes * 60 * 1000;
}

export function initWeatherWithGeolocation(): void {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        CONFIG.lat = pos.coords.latitude;
        CONFIG.lon = pos.coords.longitude;
        CONFIG.locationName = `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
        fetchWeather();
      },
      () => fetchWeather(),
      { timeout: 5000 }
    );
  } else {
    fetchWeather();
  }
}
