"use client"

import * as React from "react"

export type ThemeMode = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "theme"

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyResolvedTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
}

function applyThemeMode(mode: ThemeMode, resolved: ResolvedTheme) {
  const root = document.documentElement
  if (mode === "system") {
    // Let CSS media queries handle system mode; keep classes off.
    root.classList.remove("dark", "light")
    return
  }

  root.classList.toggle("dark", resolved === "dark")
  root.classList.toggle("light", resolved === "light")
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: React.ReactNode
  defaultTheme?: ThemeMode
}) {
  const [theme, setThemeState] = React.useState<ThemeMode>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>("light")
  const [mounted, setMounted] = React.useState(false)

  // Load stored theme after mount.
  React.useEffect(() => {
    setMounted(true)
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? defaultTheme
    setThemeState(stored)
  }, [defaultTheme])

  // Keep resolved theme in sync, including system changes.
  React.useEffect(() => {
    if (!mounted) return

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const computeResolved = (t: ThemeMode): ResolvedTheme => (t === "system" ? getSystemTheme() : t)
    const nextResolved = computeResolved(theme)
    setResolvedTheme(nextResolved)
    applyThemeMode(theme, nextResolved)

    if (theme !== "system") return

    const onChange = () => {
      const updated = getSystemTheme()
      setResolvedTheme(updated)
      applyThemeMode("system", updated)
    }

    // Safari still prefers addListener/removeListener.
    mq.addEventListener?.("change", onChange)
    // @ts-expect-error - legacy API for older Safari
    mq.addListener?.(onChange)
    return () => {
      mq.removeEventListener?.("change", onChange)
      // @ts-expect-error - legacy API for older Safari
      mq.removeListener?.(onChange)
    }
  }, [theme, mounted])

  const setTheme = React.useCallback((next: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
