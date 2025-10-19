import type { Metadata } from "next";
import { createTranslator } from "use-intl/core";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getPostsForTag, paginatePostsByTag } from "@/lib/blog";
import { getMessages } from "@/i18n/getMessages";
import { SITE_URL, buildCanonicalUrl, buildLanguageAlternates, localeToBcp47 } from "@/lib/seo";

export const dynamic = "force-dynamic";

function resolveLocale(locale: string): Locale | null {
  return locales.find((item) => item === locale) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, tag: rawTag } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) {
    notFound();
  }

  const tag = decodeURIComponent(rawTag);
  const posts = getPostsForTag(locale, tag);
  if (posts.length === 0) {
    return {};
  }

  const messages = await getMessages(locale);
  const t = createTranslator({ locale, namespace: "Tag", messages });
  const path = `/blog/tag/${encodeURIComponent(tag)}/`;
  const canonical = buildCanonicalUrl(locale, path);
  const availableLocales = locales.filter(
    (candidateLocale) => getPostsForTag(candidateLocale, tag).length > 0,
  );
  const languages =
    availableLocales.length > 1 ? buildLanguageAlternates(path, { locales: availableLocales }) : undefined;

  return {
    title: t("listingTitle", { tag }),
    description: t("listingDescription", { tag, count: posts.length }),
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
  };
}

export default async function TagPage({ params }: { params: Promise<{ locale: string; tag: string }> }) {
  const { locale: rawLocale, tag: rawTag } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) {
    notFound();
  }

  const tag = decodeURIComponent(rawTag);
  const pagination = paginatePostsByTag(locale, tag, 1);
  if (pagination.totalCount === 0) {
    notFound();
  }

  const messages = await getMessages(locale);
  const t = createTranslator({ locale, namespace: "Tag", messages });
  const basePath = `/blog/tag/${encodeURIComponent(tag)}`;
  const relativePath = `/blog/tag/${encodeURIComponent(tag)}/`;
  const canonical = buildCanonicalUrl(locale, relativePath);
  const availableLocales = locales.filter((candidateLocale) => getPostsForTag(candidateLocale, tag).length > 0);
  const languages = buildLanguageAlternates(relativePath, { locales: availableLocales });
  const sameAs = Array.from(new Set(Object.values(languages))).filter((url) => url !== canonical);

  return (
    <BlogLayoutView locale={locale}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t("listingTitle", { tag }),
          alternateName: [tag, encodeURIComponent(tag)],
          inLanguage: localeToBcp47[locale] ?? locale,
          url: canonical,
          isPartOf: `${SITE_URL}${locale === defaultLocale ? "/blog/" : `/${locale}/blog/`}`,
          sameAs,
          about: {
            "@type": "DefinedTerm",
            name: tag,
            alternateName: encodeURIComponent(tag),
            inDefinedTermSet: `${SITE_URL}/blog/tags`,
          },
        }}
      />
      <section className="flex flex-col gap-4 rounded-[2rem] border border-[#eadfcd]/70 bg-white/70 p-6 shadow-[0_24px_70px_-40px_rgba(40,30,20,0.4)] sm:p-8">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f4eadb] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#7c6d5d]">
          {t("badge")}
        </span>
        <h1 className="text-[clamp(2rem,5vw,2.8rem)] font-semibold leading-tight text-[#2f2b26]">
          {t("listingTitle", { tag })}
        </h1>
        <p className="text-sm leading-relaxed text-[#4b4139]">
          {t("listingDescription", { tag, count: pagination.totalCount })}
        </p>
      </section>

      <BlogExplorer
        enableSearch={false}
        initialPosts={pagination.items}
        allPosts={pagination.items}
        pagination={{
          basePath,
          currentPage: 1,
          totalPages: pagination.totalPages,
        }}
      />
    </BlogLayoutView>
  );
}
