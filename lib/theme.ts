export type Theme = "light" | "dark"

export const THEME_STORAGE_KEY = "prince2-theme"

export function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "light"
  const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
  return raw === "dark" ? "dark" : "light"
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

export function storeTheme(theme: Theme) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}
