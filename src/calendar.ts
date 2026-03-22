import { pad, WEEKDAYS } from "./config";
import type { HolidayMap } from "./holidays";

interface CalendarCell {
  day: number;
  current: boolean;
  holiday?: string | null;
}

export function renderCalendar(
  id: string,
  year: number,
  month: number,
  today: Date,
  holidays: HolidayMap
): void {
  const container = document.getElementById(id);
  if (!container) return;

  const isCurrent =
    today.getFullYear() === year && today.getMonth() === month - 1;

  let html = `<div class="calendar-header">
    <div class="calendar-title">${month}月</div>
    <div class="calendar-title-sub">${year}</div>
  </div><div class="calendar-grid">`;

  // Header row
  html += '<div class="calendar-row">';
  for (let d = 0; d < 7; d++) {
    const hc =
      "calendar-cell header" + (d === 0 ? " sun" : "") + (d === 6 ? " sat" : "");
    html += `<div class="${hc}">${WEEKDAYS[d]}</div>`;
  }
  html += "</div>";

  // Build cells
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevDaysInMonth = new Date(year, month - 1, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let p = firstDay - 1; p >= 0; p--) {
    cells.push({ day: prevDaysInMonth - p, current: false });
  }
  for (let c = 1; c <= daysInMonth; c++) {
    const key = `${year}-${pad(month)}-${pad(c)}`;
    cells.push({ day: c, current: true, holiday: holidays[key] || null });
  }
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let n = 1; n <= remaining; n++) {
      cells.push({ day: n, current: false });
    }
  }
  while (cells.length < 35) {
    cells.push({
      day: cells.length - daysInMonth - firstDay + 1,
      current: false,
    });
  }

  // Render rows
  for (let r = 0; r < cells.length; r += 7) {
    html += '<div class="calendar-row">';
    for (let col = 0; col < 7; col++) {
      const cell = cells[r + col];
      if (!cell) break;

      let cls = "calendar-cell";
      const adow = (r + col) % 7;

      if (!cell.current) {
        cls += " other-month";
      } else {
        if (adow === 0 || cell.holiday) cls += " sun";
        else if (adow === 6) cls += " sat";
        if (cell.holiday) cls += " holiday";
        if (isCurrent && cell.day === today.getDate()) cls += " today";
      }

      const isToday = cell.current && isCurrent && cell.day === today.getDate();
      const inner = isToday ? `<span>${cell.day}</span>` : `${cell.day}`;

      html += `<div class="${cls}">${inner}</div>`;
    }
    html += "</div>";
  }

  html += "</div>";
  container.innerHTML = html;
}
