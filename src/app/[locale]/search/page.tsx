import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchPageView, getSearchPageMetadata } from "@/app/blog/_shared/search-page";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { locales, type Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

function resolveLocale(locale: string): Locale | null {
  return locales.find((item) => item === locale) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) {
    notFound();
  }

  return getSearchPageMetadata(locale);
}

export default async function LocaleSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ search?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) {
    notFound();
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;

  return (
    <BlogLayoutView locale={locale}>
      <SearchPageView locale={locale} initialQuery={search} />
    </BlogLayoutView>
  );
}
