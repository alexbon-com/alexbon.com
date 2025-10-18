import { locales, type Locale } from "@/i18n/config";
import { buildJsonFeed } from "@/lib/feed";

export const revalidate = 3600;
export const dynamic = "force-static";

function isLocale(candidate: string): candidate is Locale {
  return locales.includes(candidate as Locale);
}

export async function GET(
  _: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale: rawLocale } = await context.params;

  if (!isLocale(rawLocale)) {
    return new Response("Not Found", { status: 404 });
  }

  return buildJsonFeed(rawLocale);
}
