import "./style.css";
import { pad } from "./config";
import { updateClock } from "./clock";
import { renderCalendar } from "./calendar";
import { getHolidays } from "./holidays";
import { fetchWeather, shouldRefreshWeather, initWeatherWithGeolocation } from "./weather";
import { initAudio, unlockAudio, checkChime } from "./chime";
import { initTheme } from "./theme";

let lastRenderedDate = "";

function renderAll(): void {
  const now = new Date();
  const dk = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  if (dk !== lastRenderedDate) {
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    const holidays = getHolidays(year);
    if (nextYear !== year) {
      const nh = getHolidays(nextYear);
      Object.assign(holidays, nh);
    }

    renderCalendar("cal-current", year, month, now, holidays);
    renderCalendar("cal-next", nextYear, nextMonth, now, holidays);
    lastRenderedDate = dk;
  }

  updateClock();
  checkChime();

  if (shouldRefreshWeather()) {
    fetchWeather();
  }
}

// Init
initTheme();
initAudio();
initWeatherWithGeolocation();
renderAll();
setInterval(renderAll, 1000);

// Audio unlock + fullscreen on first tap
const overlay = document.getElementById("audio-unlock");
if (overlay) {
  overlay.addEventListener("click", () => {
    unlockAudio();
    overlay.className = "audio-unlock hidden";
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    }
  });
}

// Unlock audio on any subsequent touch
document.body.addEventListener(
  "touchstart",
  () => unlockAudio(),
  { passive: true }
);
