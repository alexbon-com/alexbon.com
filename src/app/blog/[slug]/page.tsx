import type { Metadata } from "next";
import { createTranslator } from "use-intl/core";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { NoteCard } from "@/components/blog/NoteCard";
import { LicenseBlock } from "@/components/blog/LicenseBlock";
import { MDXContent } from "@/components/blog/mdx-content";
import { TableOfContents, type TocEntry } from "@/components/blog/TableOfContents";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { contentByLocale } from "@/content";
import { defaultLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/getMessages";
import { formatDate } from "@/lib/datetime";
import { buildCanonicalUrl, buildLanguageAlternates, buildLocalizedPath } from "@/lib/seo";
import { buildPostTypePath, getPostTypeLabel } from "@/lib/post-types";

export const dynamic = "force-dynamic";
import {
  buildBreadcrumbJsonLd,
  getPostsByLocale,
  getPostBySlug,
  getPostTranslations,
  getPostsForTag,
  type BlogPost,
} from "@/lib/blog";

const locale = defaultLocale;
const brandName = contentByLocale[locale].brandName;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(locale, slug);
  if (!post) {
    return {};
  }

  const typeLabel = getPostTypeLabel(locale, post.type);
  const path = `/blog/${post.slug}/`;
  const canonical = buildCanonicalUrl(locale, path);
  const translations = getPostTranslations(locale, post.slug);
  const availableLocales = Array.from(translations.keys()) as Locale[];
  const relativePaths: Partial<Record<Locale, string>> = {};
  for (const [candidateLocale, candidatePost] of translations) {
    relativePaths[candidateLocale] = `/blog/${candidatePost.slug}/`;
  }
  const languages =
    availableLocales.length > 1 ? buildLanguageAlternates(relativePaths, { locales: availableLocales }) : undefined;

  return {
    title: `${post.title} | ${typeLabel} ${brandName}`,
    description: post.description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      type: post.type === "article" || post.type === "story" ? "article" : "website",
      title: post.title,
      description: post.description ?? undefined,
      url: canonical,
      siteName: brandName,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description ?? undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(locale, slug);
  if (!post) {
    notFound();
  }

  const relatedPosts = post.tags.length > 0 ? getPostsForTag(locale, post.tags[0], { original: post }) : [];
  const siblings = getPostsByLocale(locale);
  const currentIndex = siblings.findIndex((item) => item.slug === post.slug);
  const previous = currentIndex > 0 ? siblings[currentIndex - 1] : undefined;
  const next = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : undefined;
  const toc = Array.isArray(post.toc) ? post.toc : (post.toc as { items?: TocEntry[] } | undefined)?.items ?? [];
  const hasToc = toc.length > 0;
  const messages = await getMessages(locale);
  const t = createTranslator({ locale, namespace: "Post", messages });
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const typeLabel = getPostTypeLabel(locale, post.type);
  const typeHref = buildPostTypePath(locale, post.type);
  const isNote = post.type === "note";
  const translations = getPostTranslations(locale, post.slug);
  const alternatePaths: Partial<Record<Locale, string>> = {};
  for (const [variantLocale, variantPost] of translations) {
    alternatePaths[variantLocale] = buildLocalizedPath(variantLocale, `/blog/${variantPost.slug}/`);
  }

  return (
    <BlogLayoutView locale={locale} alternatePaths={alternatePaths}>
      <JsonLd data={[post.jsonLd, buildBreadcrumbJsonLd(locale, post)]} />
      <article className="section-card-strong flex flex-col gap-10 rounded-[2.5rem] p-6 sm:p-10">
        <header className="flex flex-col gap-4">
          <Link
            href={typeHref}
            className="badge-soft inline-flex w-fit items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] transition-colors hover:bg-[#f2993f]/90 hover:text-white"
          >
            {typeLabel}
          </Link>
          {isNote ? (
            <h1 className="sr-only">{post.title}</h1>
          ) : (
            <h1 className="text-balance text-[clamp(2.2rem,6vw,3.4rem)] font-semibold leading-tight text-strong">
              {post.title}
            </h1>
          )}
          <div className="flex flex-wrap gap-3 text-sm text-muted">
            <time dateTime={post.publishedAt} className="font-medium">
              {t("publishedOn", { date: formatDate(post.publishedDate, locale) })}
            </time>
          </div>
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 text-xs font-semibold text-muted">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`${prefix}/blog/tag/${encodeURIComponent(tag)}`}
                    className="tag-chip inline-flex items-center px-3 py-1 transition-colors"
                  >
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex-1">
            <div className="prose prose-article max-w-none text-[clamp(1rem,3vw,1.15rem)] leading-relaxed">
              <MDXContent code={post.body} />
            </div>
          </div>

          {hasToc && (
            <div className="w-full lg:w-72">
              <TableOfContents items={toc} className="sticky top-32" title={t("tocTitle")} ariaLabel={t("tocAriaLabel")} />
            </div>
          )}
        </div>

        <LicenseBlock />
      </article>

      <section className="section-card flex flex-col gap-6 rounded-[2rem] p-6 sm:p-8">
        <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold leading-tight text-strong">
          {t("neighborsHeading")}
        </h2>
        <div className="flex flex-col gap-2 text-sm text-primary">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-strong">{t("previous")}</span>
            {previous ? (
              <Link href={`${prefix}/blog/${previous.slug}`} className="badge-soft inline-flex items-center rounded-full px-4 py-2 transition-colors hover:bg-[#f2993f]/90 hover:text-white">
                {previous.title}
              </Link>
            ) : (
              <span className="text-disabled">{t("firstPost")}</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-strong">{t("next")}</span>
            {next ? (
              <Link href={`${prefix}/blog/${next.slug}`} className="badge-soft inline-flex items-center rounded-full px-4 py-2 transition-colors hover:bg-[#f2993f]/90 hover:text-white">
                {next.title}
              </Link>
            ) : (
              <span className="text-disabled">{t("lastPost")}</span>
            )}
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="section-card flex flex-col gap-6 rounded-[2rem] p-6 sm:p-8">
          <h2 className="text-[clamp(1.5rem,3.8vw,2.1rem)] font-semibold leading-tight text-strong">
            {t("moreOnTag", { tag: post.tags[0] })}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {relatedPosts.slice(0, 4).map((item) =>
              item.type === "note" ? <NoteCard key={item.slug} post={item} /> : <ArticleCardMini key={item.slug} post={item} />,
            )}
          </div>
        </section>
      )}
    </BlogLayoutView>
  );
}

function ArticleCardMini({ post }: { post: BlogPost }) {
  return (
    <article className="section-card flex w-full flex-col gap-3 rounded-3xl p-5">
      <h3 className="text-[clamp(1.15rem,3vw,1.4rem)] font-semibold text-strong">
        <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
          {post.title}
        </Link>
      </h3>
      <time dateTime={post.publishedAt} className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
        {formatDate(post.publishedDate, locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </time>
    </article>
  );
}
