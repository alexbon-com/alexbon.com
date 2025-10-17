import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { locales, type Locale } from "@/i18n/config";
import { getPostsByType, paginatePostsByType } from "@/lib/blog";
import {
  buildPostTypePath,
  buildPostTypeRelativePath,
  getPostTypeLabel,
  getPostTypePageDescription,
  getPostTypePageTitle,
  PostType,
  isValidPostType,
} from "@/lib/post-types";
import { buildCanonicalUrl, buildLanguageAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

function resolveLocale(locale: string): Locale | null {
  return locales.find((item) => item === locale) ?? null;
}

type Params = { locale: string; type: string; pageNumber: string };

export const generateMetadata = async ({ params }: { params: Promise<Params> }): Promise<Metadata> => {
  const { locale: rawLocale, type: rawType, pageNumber: rawPage } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) {
    notFound();
  }

  if (!isValidPostType(rawType)) {
    return {};
  }

  const pageNumber = Number.parseInt(rawPage, 10);
  if (Number.isNaN(pageNumber) || pageNumber <= 1) {
    return {};
  }

  const type = rawType as PostType;
  const posts = getPostsByType(locale, type);
  if (posts.length === 0) {
    return {};
  }

  const pagination = paginatePostsByType(locale, type, pageNumber);
  if (pagination.totalCount === 0 || pageNumber > pagination.totalPages) {
    return {};
  }

  const title = getPostTypePageTitle(locale, type, pageNumber);
  const description = getPostTypePageDescription(locale, type, posts.length, pageNumber);
  const path = `${buildPostTypeRelativePath(type)}page/${pageNumber}/`;
  const canonical = buildCanonicalUrl(locale, path);
  const availableLocales = locales.filter((candidate) => {
    const { totalPages } = paginatePostsByType(candidate, type, 1);
    return totalPages >= pageNumber && totalPages > 1;
  });
  const languages =
    availableLocales.length > 1 ? buildLanguageAlternates(path, { locales: availableLocales }) : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
  };
};

export default async function TypeCollectionPageNumber({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, type: rawType, pageNumber: rawPage } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) {
    notFound();
  }

  if (!isValidPostType(rawType)) {
    notFound();
  }

  const pageNumber = Number.parseInt(rawPage, 10);
  if (Number.isNaN(pageNumber) || pageNumber <= 1) {
    notFound();
  }

  const type = rawType as PostType;
  const pagination = paginatePostsByType(locale, type, pageNumber);
  if (pageNumber > pagination.totalPages || pagination.totalCount === 0) {
    notFound();
  }

  const allPosts = getPostsByType(locale, type);
  const label = getPostTypeLabel(locale, type);
  const title = getPostTypePageTitle(locale, type, pageNumber);
  const description = getPostTypePageDescription(locale, type, allPosts.length, pageNumber);

  return (
    <BlogLayoutView locale={locale}>
      <section className="flex flex-col gap-4 rounded-[2rem] border border-[#eadfcd]/70 bg-white/70 p-5 text-sm text-[#4b4139] shadow-[0_24px_70px_-40px_rgba(40,30,20,0.4)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7c6d5d]">{label}</p>
        <h1 className="text-[clamp(1.8rem,4.5vw,2.6rem)] font-semibold leading-tight text-[#2f2b26]">{title}</h1>
        <p>{description}</p>
      </section>

      <BlogExplorer
        initialPosts={pagination.items}
        allPosts={allPosts}
        pagination={{
          basePath: buildPostTypePath(locale, type),
          currentPage: pageNumber,
          totalPages: pagination.totalPages,
        }}
      />
    </BlogLayoutView>
  );
}
