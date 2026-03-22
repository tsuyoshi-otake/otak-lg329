import { pad } from "./config";

export type HolidayMap = Record<string, string>;

function happyMonday(year: number, month: number, weekNum: number): number {
  const d = new Date(year, month - 1, 1).getDay();
  const first = d <= 1 ? 1 - d + 1 : 8 - d + 1;
  return first + (weekNum - 1) * 7;
}

export function getHolidays(year: number): HolidayMap {
  const holidays: HolidayMap = {};

  function add(m: number, d: number, name: string) {
    holidays[`${year}-${pad(m)}-${pad(d)}`] = name;
  }

  // Fixed holidays
  add(1, 1, "元日");
  add(2, 11, "建国記念の日");
  add(2, 23, "天皇誕生日");
  add(4, 29, "昭和の日");
  add(5, 3, "憲法記念日");
  add(5, 4, "みどりの日");
  add(5, 5, "こどもの日");
  add(8, 11, "山の日");
  add(11, 3, "文化の日");
  add(11, 23, "勤労感謝の日");

  // Happy Monday
  add(1, happyMonday(year, 1, 2), "成人の日");
  add(7, happyMonday(year, 7, 3), "海の日");
  add(9, happyMonday(year, 9, 3), "敬老の日");
  add(10, happyMonday(year, 10, 2), "スポーツの日");

  // Equinoxes
  const vernalDay = Math.floor(
    20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4)
  );
  add(3, vernalDay, "春分の日");

  const autumnalDay = Math.floor(
    23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4)
  );
  add(9, autumnalDay, "秋分の日");

  // Substitute holidays (振替休日)
  for (const key of Object.keys(holidays)) {
    const [y, m, d] = key.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    if (dt.getDay() === 0) {
      const nd = new Date(dt.getTime() + 86400000);
      const nk = `${year}-${pad(nd.getMonth() + 1)}-${pad(nd.getDate())}`;
      if (!holidays[nk]) holidays[nk] = "振替休日";
    }
  }

  // 国民の休日 (between 敬老の日 and 秋分の日)
  const kd = happyMonday(year, 9, 3);
  if (autumnalDay - kd === 2) {
    add(9, kd + 1, "国民の休日");
  }

  return holidays;
}
