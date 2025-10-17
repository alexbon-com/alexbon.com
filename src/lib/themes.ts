export type ThemeId = "light" | "dark" | "sky" | "sand";

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  description: string;
  icon: string;
  swatch: [string, string];
}

export const DEFAULT_THEME: ThemeId = "light";

export const themes: ThemeDefinition[] = [
  {
    id: "light",
    label: "Світла",
    description: "Тепла кремова палітра за замовчуванням.",
    icon: "☀️",
    swatch: ["#f6f2e9", "#f2993f"],
  },
  {
    id: "dark",
    label: "Темна",
    description: "Приглушені синьо-графітові відтінки.",
    icon: "🌙",
    swatch: ["#101623", "#6376ff"],
  },
  {
    id: "sky",
    label: "Блакитна",
    description: "Світло-блакитні відтінки зі свіжими акцентами.",
    icon: "🌤️",
    swatch: ["#e7f1ff", "#4aa3ff"],
  },
  {
    id: "sand",
    label: "Піщана",
    description: "Мʼякі сонячні й пісочні кольори.",
    icon: "🌅",
    swatch: ["#fff3e0", "#f19a3f"],
  },
];

export function isThemeId(value?: string | null): value is ThemeId {
  return value !== undefined && value !== null && themes.some((theme) => theme.id === value);
}
