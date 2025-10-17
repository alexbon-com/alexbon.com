import { createTranslator } from "use-intl/core";
import { NotFoundView } from "@/components/NotFoundView";
import { defaultLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/getMessages";

export default async function NotFound() {
  const messages = await getMessages(defaultLocale);
  const t = createTranslator({ locale: defaultLocale, namespace: "NotFound", messages });
  return <NotFoundView locale={defaultLocale} t={t} />;
}
