import { createTranslator } from "use-intl/core";
import { NotFoundView } from "@/components/NotFoundView";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/getMessages";

function resolveLocale(locale: string): Locale | null {
  return locales.find((candidate) => candidate === locale) ?? null;
}

interface LocaleParams {
  locale?: string;
}

export default async function LocaleNotFound({ params }: { params?: LocaleParams } = {}) {
  const resolvedLocale = resolveLocale(params?.locale ?? "") ?? defaultLocale;
  const messages = await getMessages(resolvedLocale);
  const t = createTranslator({ locale: resolvedLocale, namespace: "NotFound", messages });
  return <NotFoundView locale={resolvedLocale} t={t} />;
}
