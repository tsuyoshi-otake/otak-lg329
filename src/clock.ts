import { pad, WEEKDAYS_LONG } from "./config";

let colonBlink = false;

export function updateClock(): void {
  const now = new Date();
  const dow = now.getDay();

  const yearEl = document.getElementById("clock-year");
  const monthdayEl = document.getElementById("clock-monthday");
  const weekdayEl = document.getElementById("clock-weekday");
  const timeEl = document.getElementById("clock-time");
  const secondsEl = document.getElementById("clock-seconds");

  if (yearEl) yearEl.textContent = `${now.getFullYear()}年`;
  if (monthdayEl)
    monthdayEl.textContent = `${now.getMonth() + 1}月${now.getDate()}日`;

  if (weekdayEl) {
    weekdayEl.textContent = WEEKDAYS_LONG[dow];
    weekdayEl.className =
      "clock-weekday " +
      (dow === 0 ? "sunday" : dow === 6 ? "saturday" : "weekday");
  }

  colonBlink = !colonBlink;
  const cc = colonBlink ? "colon blink" : "colon";
  if (timeEl) {
    timeEl.innerHTML = `${pad(now.getHours())}<span class="${cc}">:</span>${pad(now.getMinutes())}`;
  }
  if (secondsEl) secondsEl.textContent = pad(now.getSeconds());
}
