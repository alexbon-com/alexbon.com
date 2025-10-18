import { defaultLocale, locales, type Locale } from "@/i18n/config";

export const SITE_URL = "https://alexbon.com";

const hreflangMap: Record<Locale, string> = {
  ua: "uk-UA",
  ru: "ru-RU",
  en: "en",
};

export const localeToBcp47: Record<Locale, string> = {
  ua: "uk",
  ru: "ru",
  en: "en",
};

export const ABOUT_HERO_IMAGE = `${SITE_URL}/images/about-portrait-hero.webp`;
export const DEFAULT_POST_IMAGE = `${SITE_URL}/images/reflection.webp`;

export const PERSON_JOB_TITLES: Record<Locale, string[]> = {
  ua: ["Психолог", "Лайф-коуч", "Експерт з усвідомленості та медитації"],
  ru: ["Психолог", "Лайф-коуч", "Эксперт по осознанности и медитации"],
  en: ["Psychologist", "Life coach", "Mindfulness and meditation expert"],
};

export const PERSON_KNOWS_ABOUT: Record<Locale, string[]> = {
  ua: ["Психологія", "Лайф-коучинг", "Усвідомленість", "Медитація", "Особистісний розвиток"],
  ru: ["Психология", "Лайф-коучинг", "Осознанность", "Медитация", "Саморазвитие"],
  en: ["Psychology", "Life coaching", "Mindfulness", "Meditation", "Personal growth"],
};

function normalizePath(path: string): string {
  if (!path || path === "/") {
    return "/";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildLocalizedPath(locale: Locale, path: string): string {
  const normalized = normalizePath(path);
  if (normalized === "/") {
    return locale === defaultLocale ? "/" : `/${locale}/`;
  }
  return locale === defaultLocale ? normalized : `/${locale}${normalized}`;
}

export function buildCanonicalUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${buildLocalizedPath(locale, path)}`;
}

export function buildLanguageAlternates(
  pathOrMap: string | Partial<Record<Locale, string>>,
  options: { locales?: Locale[] } = {},
): Record<string, string> {
  const allowedLocales = options.locales
    ? options.locales.filter((locale) => locales.includes(locale))
    : locales.slice();

  if (!allowedLocales.includes(defaultLocale)) {
    allowedLocales.push(defaultLocale);
  }

  const uniqueLocales = Array.from(new Set(allowedLocales));
  const languages: Record<string, string> = {};

  for (const locale of uniqueLocales) {
    const candidatePath =
      typeof pathOrMap === "string"
        ? pathOrMap
        : pathOrMap[locale] ?? pathOrMap[defaultLocale];
    if (!candidatePath) {
      continue;
    }
    const normalized = normalizePath(candidatePath);
    const hreflang = hreflangMap[locale];
    if (!hreflang) continue;
    languages[hreflang] = `${SITE_URL}${buildLocalizedPath(locale, normalized)}`;
  }

  const defaultPath =
    typeof pathOrMap === "string"
      ? pathOrMap
      : pathOrMap[defaultLocale] ?? "/";
  languages["x-default"] = `${SITE_URL}${buildLocalizedPath(defaultLocale, normalizePath(defaultPath))}`;
  return languages;
}
