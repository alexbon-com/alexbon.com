import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/getMessages";

function resolveLocale(candidate: string | undefined): Locale {
  if (!candidate) {
    return defaultLocale;
  }

  return locales.includes(candidate as Locale) ? (candidate as Locale) : defaultLocale;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = resolveLocale(await requestLocale);

  return {
    locale,
    messages: await getMessages(locale),
  };
});
