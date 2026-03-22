const THEMES = ["midnight", "emerald", "amber", "sakura", "mono"] as const;
type Theme = (typeof THEMES)[number];

const THEME_LABELS: Record<Theme, string> = {
  midnight: "Midnight",
  emerald: "Emerald",
  amber: "Amber",
  sakura: "Sakura",
  mono: "Mono",
};

let currentIndex = 0;

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-btn");
  if (btn) btn.textContent = THEME_LABELS[theme];
  localStorage.setItem("signage-theme", theme);
}

export function initTheme(): void {
  const saved = localStorage.getItem("signage-theme") as Theme | null;
  if (saved && THEMES.includes(saved)) {
    currentIndex = THEMES.indexOf(saved);
  }
  applyTheme(THEMES[currentIndex]);

  const btn = document.getElementById("theme-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % THEMES.length;
      applyTheme(THEMES[currentIndex]);
    });
  }
}
