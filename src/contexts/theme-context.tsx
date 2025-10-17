'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_THEME, type ThemeId, themes } from "@/lib/themes";

const THEME_COOKIE = "NEXT_THEME";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  themes: typeof themes;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  themes,
});

export function ThemeProvider({ initialTheme, children }: { initialTheme: ThemeId; children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_COOKIE, theme);
    } catch {
      // ignore storage errors
    }
    document.cookie = `${THEME_COOKIE}=${theme}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      themes,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
