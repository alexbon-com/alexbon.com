import type { Metadata } from "next";
import { SearchPageView, getSearchPageMetadata } from "@/app/blog/_shared/search-page";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { defaultLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export const generateMetadata = (): Metadata => getSearchPageMetadata(defaultLocale);

export default async function SearchRootPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;

  return (
    <BlogLayoutView locale={defaultLocale}>
      <SearchPageView locale={defaultLocale} initialQuery={search} />
    </BlogLayoutView>
  );
}
