import type { Locale } from "@/i18n/config";

const formatterCache = new Map<string, Intl.DateTimeFormat>();

const localeMap: Record<Locale, string> = {
  ru: "ru-RU",
  ua: "uk-UA",
  en: "en-US",
};

export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions) {
  const key = `${locale}-${JSON.stringify(options ?? {})}`;
  let formatter = formatterCache.get(key);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(localeMap[locale], options ?? {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    formatterCache.set(key, formatter);
  }

  return formatter.format(date);
}
