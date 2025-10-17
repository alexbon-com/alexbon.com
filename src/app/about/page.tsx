import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { LandingPage } from "@/components/LandingPage";
import { contentByLocale } from "@/content";
import { defaultLocale } from "@/i18n/config";
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

export const generateMetadata = async (): Promise<Metadata> => {
  const content = contentByLocale[defaultLocale];
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: buildCanonicalUrl(defaultLocale, "/about/"),
      languages: buildLanguageAlternates("/about/"),
    },
  };
};

export default function AboutPage() {
  const content = contentByLocale[defaultLocale];
  const canonical = buildCanonicalUrl(defaultLocale, "/about/");
  const language = localeToBcp47[defaultLocale];
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
          isPartOf: `${SITE_URL}/`,
          license: "https://creativecommons.org/licenses/by/4.0/",
          mainEntity: {
            "@type": "Person",
            "@id": personId,
            name: content.brandName,
            alternateName: ["Alex Bon"],
            jobTitle: PERSON_JOB_TITLES[defaultLocale],
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
