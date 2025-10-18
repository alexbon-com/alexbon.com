import { defaultLocale } from "@/i18n/config";
import { buildRssFeed } from "@/lib/feed";

export const revalidate = 3600;
export const dynamic = "force-static";

export async function GET() {
  return buildRssFeed(defaultLocale);
}
