import type { Metadata } from "next";
import { createTranslator } from "use-intl/core";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { defaultLocale, locales } from "@/i18n/config";
import { getPostsForTag, paginatePostsByTag } from "@/lib/blog";
import { getMessages } from "@/i18n/getMessages";
import { SITE_URL, buildCanonicalUrl, buildLanguageAlternates, localeToBcp47 } from "@/lib/seo";

type Params = { tag: string };

export const generateMetadata = async ({ params }: { params: Promise<Params> }): Promise<Metadata> => {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getPostsForTag(defaultLocale, tag);
  if (posts.length === 0) {
    return {};
  }

  const messages = await getMessages(defaultLocale);
  const t = createTranslator({ locale: defaultLocale, namespace: "Tag", messages });
  const path = `/blog/tag/${encodeURIComponent(tag)}/`;
  const canonical = buildCanonicalUrl(defaultLocale, path);
  const availableLocales = locales.filter((locale) => getPostsForTag(locale, tag).length > 0);
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
};

export default async function DefaultTagPage({ params }: { params: Promise<Params> }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const pagination = paginatePostsByTag(defaultLocale, tag, 1);
  if (pagination.totalCount === 0) {
    notFound();
  }

  const messages = await getMessages(defaultLocale);
  const t = createTranslator({ locale: defaultLocale, namespace: "Tag", messages });
  const basePath = `/blog/tag/${encodeURIComponent(tag)}`;
  const canonical = buildCanonicalUrl(defaultLocale, `${basePath}/`);
  const availableLocales = locales.filter((locale) => getPostsForTag(locale, tag).length > 0);
  const languages = buildLanguageAlternates(`${basePath}/`, { locales: availableLocales });
  const sameAs = Array.from(new Set(Object.values(languages))).filter((url) => url !== canonical);

  return (
    <BlogLayoutView locale={defaultLocale}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t("listingTitle", { tag }),
          alternateName: [tag, encodeURIComponent(tag)],
          inLanguage: localeToBcp47[defaultLocale],
          url: canonical,
          isPartOf: `${SITE_URL}/blog/`,
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
