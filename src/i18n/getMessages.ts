import type { Locale } from "@/i18n/config";

export async function getMessages(locale: Locale) {
  const messages = await import(`@/messages/${locale}.json`).then((mod) => mod.default);
  return messages;
}
