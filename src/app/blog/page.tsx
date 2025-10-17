import { BlogIndexView, getBlogIndexMetadata } from "@/app/blog/_shared/index-page";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { defaultLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export const generateMetadata = () => getBlogIndexMetadata(defaultLocale);

export default async function BlogRootPage({ searchParams }: { searchParams?: Promise<{ search?: string }> }) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;

  return (
    <BlogLayoutView locale={defaultLocale}>
      <BlogIndexView locale={defaultLocale} initialQuery={search} />
    </BlogLayoutView>
  );
}
