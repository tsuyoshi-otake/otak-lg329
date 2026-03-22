import { pad, WEEKDAYS_LONG } from "./config";

let colonBlink = false;

function digit(ch: string, cls: string = "d"): string {
  return `<span class="${cls}">${ch}</span>`;
}

export function updateClock(): void {
  const now = new Date();
  const dow = now.getDay();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  const yearEl = document.getElementById("clock-year");
  const monthdayEl = document.getElementById("clock-monthday");
  const weekdayEl = document.getElementById("clock-weekday");
  const timeEl = document.getElementById("clock-time");
  const secondsEl = document.getElementById("clock-seconds");

  if (yearEl) yearEl.textContent = `${now.getFullYear()}年`;

  // Month/day with fixed-width digits
  if (monthdayEl) {
    const m = String(month);
    const d = String(date);
    let html = "";
    for (const c of m) html += digit(c);
    html += `<span class="label">月</span>`;
    for (const c of d) html += digit(c);
    html += `<span class="label">日</span>`;
    monthdayEl.innerHTML = html;
  }

  if (weekdayEl) {
    weekdayEl.textContent = WEEKDAYS_LONG[dow];
    weekdayEl.className =
      "clock-weekday " +
      (dow === 0 ? "sunday" : dow === 6 ? "saturday" : "weekday");
  }

  // Time with fixed-width digit spans
  colonBlink = !colonBlink;
  if (timeEl) {
    const h = pad(now.getHours());
    const m = pad(now.getMinutes());
    const cc = colonBlink ? "colon blink" : "colon";
    timeEl.innerHTML =
      digit(h[0]) + digit(h[1]) +
      `<span class="${cc}">:</span>` +
      digit(m[0]) + digit(m[1]);
  }

  if (secondsEl) {
    const s = pad(now.getSeconds());
    secondsEl.innerHTML = digit(s[0], "ds") + digit(s[1], "ds");
  }
}
