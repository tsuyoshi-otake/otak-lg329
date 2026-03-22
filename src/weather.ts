import { CONFIG, WEEKDAYS } from "./config";

interface WmoEntry {
  icon: string;
  desc: string;
}

const WMO_CODES: Record<number, WmoEntry> = {
  0: { icon: "\u2600\uFE0F", desc: "快晴" },
  1: { icon: "\u26C5", desc: "晴れ" },
  2: { icon: "\u26C5", desc: "曇りがち" },
  3: { icon: "\u2601\uFE0F", desc: "曇り" },
  45: { icon: "\u{1F32B}\uFE0F", desc: "霧" },
  48: { icon: "\u{1F32B}\uFE0F", desc: "濃霧" },
  51: { icon: "\u{1F326}\uFE0F", desc: "小雨" },
  53: { icon: "\u{1F326}\uFE0F", desc: "小雨" },
  55: { icon: "\u{1F327}\uFE0F", desc: "小雨" },
  56: { icon: "\u2744\uFE0F", desc: "凍雨" },
  57: { icon: "\u2744\uFE0F", desc: "凍雨" },
  61: { icon: "\u{1F327}\uFE0F", desc: "小雨" },
  63: { icon: "\u{1F327}\uFE0F", desc: "雨" },
  65: { icon: "\u{1F327}\uFE0F", desc: "大雨" },
  66: { icon: "\u2744\uFE0F", desc: "凍雨" },
  67: { icon: "\u2744\uFE0F", desc: "大凍雨" },
  71: { icon: "\u{1F328}\uFE0F", desc: "小雪" },
  73: { icon: "\u{1F328}\uFE0F", desc: "雪" },
  75: { icon: "\u{1F328}\uFE0F", desc: "大雪" },
  77: { icon: "\u{1F328}\uFE0F", desc: "あられ" },
  80: { icon: "\u{1F327}\uFE0F", desc: "にわか雨" },
  81: { icon: "\u{1F327}\uFE0F", desc: "にわか雨" },
  82: { icon: "\u{1F327}\uFE0F", desc: "豪雨" },
  85: { icon: "\u{1F328}\uFE0F", desc: "にわか雪" },
  86: { icon: "\u{1F328}\uFE0F", desc: "大雪" },
  95: { icon: "\u26C8\uFE0F", desc: "雷雨" },
  96: { icon: "\u26C8\uFE0F", desc: "雷雨・雹" },
  99: { icon: "\u26C8\uFE0F", desc: "雷雨・大雹" },
};

function getWmo(code: number): WmoEntry {
  return WMO_CODES[code] || { icon: "\u2601\uFE0F", desc: "--" };
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
  const wmo = getWmo(cur.weather_code);

  const locationEl = document.getElementById("weather-location");
  if (locationEl) locationEl.textContent = CONFIG.locationName;

  const headerHtml = section.querySelector(".weather-header")?.outerHTML || "";
  let html = headerHtml;

  // Current
  html += `<div class="weather-current">
    <div class="weather-icon-large">${wmo.icon}</div>
    <div>
      <div class="weather-temp-main">${Math.round(cur.temperature_2m)}<span class="unit">\u00B0C</span></div>
      <div class="weather-condition">${wmo.desc}</div>
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
    const dwmo = getWmo(daily.weather_code[i]);
    const dowClass =
      "f-weekday" + (ddow === 0 ? " sun" : "") + (ddow === 6 ? " sat" : "");

    html += `<div class="forecast-day${isToday ? " today-forecast" : ""}">
      <div class="${dowClass}">${WEEKDAYS[ddow]}</div>
      <div class="f-date">${dDate.getMonth() + 1}/${dDate.getDate()}</div>
      <div class="f-icon">${dwmo.icon}</div>
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
