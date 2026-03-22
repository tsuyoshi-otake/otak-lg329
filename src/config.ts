export const CONFIG = {
  lat: 35.6762,
  lon: 139.6503,
  locationName: "Tokyo",
  weatherRefreshMinutes: 30,
  chimeEnabled: true,
};

export const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
export const WEEKDAYS_LONG = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
];

export function pad(n: number): string {
  return n < 10 ? "0" + n : "" + n;
}
