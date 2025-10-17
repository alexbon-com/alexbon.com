import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { LandingPage } from "@/components/LandingPage";
import { contentByLocale } from "@/content";
import { locales, type Locale } from "@/i18n/config";
import {
  ABOUT_HERO_IMAGE,
  PERSON_JOB_TITLES,
  PERSON_KNOWS_ABOUT,
  SITE_URL,
  buildCanonicalUrl,
  buildLanguageAlternates,
  localeToBcp47,
} from "@/lib/seo";

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

  const content = contentByLocale[locale];
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: buildCanonicalUrl(locale, "/about/"),
      languages: buildLanguageAlternates("/about/"),
    },
  };
}

export default async function LocaleAboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) {
    notFound();
  }

  const content = contentByLocale[locale];
  const canonical = buildCanonicalUrl(locale, "/about/");
  const language = localeToBcp47[locale] ?? locale;
  const personId = `${SITE_URL}/#alex-bon`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": `${canonical}#profile`,
          name: content.metaTitle,
          description: content.metaDescription,
          inLanguage: language,
          url: canonical,
          isPartOf: locale === "ua" ? `${SITE_URL}/` : `${SITE_URL}/${locale}/`,
          license: "https://creativecommons.org/licenses/by/4.0/",
          mainEntity: {
            "@type": "Person",
            "@id": personId,
            name: content.brandName,
            alternateName: ["Alex Bon"],
            jobTitle: PERSON_JOB_TITLES[locale],
            description: content.metaDescription,
            sameAs: ["https://www.facebook.com/mr.alexbon"],
            knowsAbout: PERSON_KNOWS_ABOUT,
            worksFor: {
              "@type": "Organization",
              name: "alexbon.com",
              url: SITE_URL,
            },
            image: ABOUT_HERO_IMAGE,
            url: SITE_URL,
          },
        }}
      />
      <LandingPage content={content} />
    </>
  );
}
