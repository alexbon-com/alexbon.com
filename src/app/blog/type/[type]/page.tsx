import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { defaultLocale, locales } from "@/i18n/config";
import { getPostsByType, paginatePostsByType } from "@/lib/blog";
import {
  buildPostTypeRelativePath,
  buildPostTypePath,
  getPostTypeDescription,
  getPostTypeLabel,
  PostType,
  isValidPostType,
} from "@/lib/post-types";
import { SITE_URL, buildCanonicalUrl, buildLanguageAlternates, localeToBcp47 } from "@/lib/seo";

type Params = { type: string };

export const generateMetadata = async ({ params }: { params: Promise<Params> }): Promise<Metadata> => {
  const { type: rawType } = await params;
  if (!isValidPostType(rawType)) {
    return {};
  }

  const type = rawType as PostType;
  const posts = getPostsByType(defaultLocale, type);
  if (posts.length === 0) {
    return {};
  }

  const label = getPostTypeLabel(defaultLocale, type);
  const description = getPostTypeDescription(defaultLocale, type, posts.length);
  const path = buildPostTypeRelativePath(type);
  const canonical = buildCanonicalUrl(defaultLocale, path);
  const availableLocales = locales.filter((locale) => getPostsByType(locale, type).length > 0);
  const languages =
    availableLocales.length > 1 ? buildLanguageAlternates(path, { locales: availableLocales }) : undefined;

  return {
    title: label,
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
  };
};

export default async function TypeCollectionPage({ params }: { params: Promise<Params> }) {
  const { type: rawType } = await params;
  if (!isValidPostType(rawType)) {
    notFound();
  }

  const type = rawType as PostType;
  const pagination = paginatePostsByType(defaultLocale, type, 1);
  if (pagination.totalCount === 0) {
    notFound();
  }

  const allPosts = getPostsByType(defaultLocale, type);
  const label = getPostTypeLabel(defaultLocale, type);
  const description = getPostTypeDescription(defaultLocale, type, pagination.totalCount);
  const basePath = buildPostTypePath(defaultLocale, type);
  const relativePath = buildPostTypeRelativePath(type);
  const canonical = buildCanonicalUrl(defaultLocale, relativePath);
  const availableLocales = locales.filter((locale) => getPostsByType(locale, type).length > 0);
  const languages = buildLanguageAlternates(relativePath, { locales: availableLocales });
  const sameAs = Array.from(new Set(Object.values(languages))).filter((url) => url !== canonical);

  return (
    <BlogLayoutView locale={defaultLocale}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: label,
          inLanguage: localeToBcp47[defaultLocale],
          description,
          url: canonical,
          isPartOf: `${SITE_URL}/blog/`,
          sameAs,
          about: {
            "@type": "DefinedTerm",
            name: label,
            inDefinedTermSet: `${SITE_URL}/blog/type`,
          },
        }}
      />

      <section className="flex flex-col gap-4 rounded-[2rem] border border-[#eadfcd]/70 bg-white/70 p-6 shadow-[0_24px_70px_-40px_rgba(40,30,20,0.4)] sm:p-8">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f4eadb] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#7c6d5d]">
          {label}
        </span>
        <h1 className="text-[clamp(2rem,5vw,2.8rem)] font-semibold leading-tight text-[#2f2b26]">{label}</h1>
        <p className="text-sm leading-relaxed text-[#4b4139]">{description}</p>
      </section>

      <BlogExplorer
        initialPosts={pagination.items}
        allPosts={allPosts}
        pagination={{
          basePath,
          currentPage: 1,
          totalPages: pagination.totalPages,
        }}
      />
    </BlogLayoutView>
  );
}
