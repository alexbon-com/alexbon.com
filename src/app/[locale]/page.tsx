import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { BlogIndexView, getBlogIndexMetadata } from "@/app/blog/_shared/index-page";
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

  return getBlogIndexMetadata(locale, { path: "/" });
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) {
    notFound();
  }

  return (
    <BlogLayoutView locale={locale}>
      <BlogIndexView locale={locale} basePath="/blog" />
    </BlogLayoutView>
  );
}
