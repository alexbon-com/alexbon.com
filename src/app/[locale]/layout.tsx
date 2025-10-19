import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { JsonLd } from "@/components/JsonLd";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { contentByLocale } from "@/content";
import { getMessages } from "@/i18n/getMessages";
import { DEFAULT_POST_IMAGE, buildCanonicalUrl, buildLanguageAlternates, SITE_URL } from "@/lib/seo";

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

  const content = contentByLocale[locale];
  const canonical = buildCanonicalUrl(locale, "/");

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    icons: {
      icon: "/images/9.jpg-128x128.png",
    },
    alternates: {
      canonical,
      languages: buildLanguageAlternates("/"),
      types: {
        "application/rss+xml": `${SITE_URL}${locale === defaultLocale ? "" : `/${locale}`}/feed.xml`,
        "application/feed+json": `${SITE_URL}${locale === defaultLocale ? "" : `/${locale}`}/feed.json`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) {
    notFound();
  }

  setRequestLocale(locale);

  const { brandName, tagline } = contentByLocale[locale];
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Moscow">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "alexbon.com",
          alternateName: brandName,
          url: SITE_URL,
          inLanguage: locales,
          license: "https://creativecommons.org/licenses/by/4.0/",
          sameAs: ["https://www.facebook.com/mr.alexbon"],
          image: DEFAULT_POST_IMAGE,
          thumbnailUrl: DEFAULT_POST_IMAGE,
          publisher: {
            "@type": "Organization",
            name: "alexbon.com",
            url: SITE_URL,
            sameAs: ["https://www.facebook.com/mr.alexbon"],
          },
          slogan: tagline,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/blog/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      {children}
    </NextIntlClientProvider>
  );
}
