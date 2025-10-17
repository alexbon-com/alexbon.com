import type { Metadata } from "next";
import { createTranslator } from "use-intl/core";
import { notFound } from "next/navigation";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getPostsByLocale, paginatePosts } from "@/lib/blog";
import { getMessages } from "@/i18n/getMessages";
import { buildCanonicalUrl, buildLanguageAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

function resolveLocale(locale: string): Locale | null {
  return locales.find((item) => item === locale) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pageNumber: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, pageNumber: rawPage } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) {
    notFound();
  }

  const pageNumber = Number.parseInt(rawPage, 10);
  if (Number.isNaN(pageNumber) || pageNumber <= 1) {
    return {};
  }

  const messages = await getMessages(locale);
  const t = createTranslator({ locale, namespace: "Pagination", messages });
  const path = `/blog/page/${pageNumber}/`;
  const canonical = buildCanonicalUrl(locale, path);
  const availableLocales = locales.filter((candidate) => {
    const { totalPages } = paginatePosts(candidate, 1);
    return totalPages >= pageNumber && totalPages > 1;
  });
  const languages =
    availableLocales.length > 1 ? buildLanguageAlternates(path, { locales: availableLocales }) : undefined;

  return {
    title: t("archiveTitle", { page: pageNumber }),
    description: t("archiveDescription", { page: pageNumber }),
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
  };
}

export default async function BlogPageNumber({ params }: { params: Promise<{ locale: string; pageNumber: string }> }) {
  const { locale: rawLocale, pageNumber: rawPage } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) {
    notFound();
  }

  const pageNumber = Number.parseInt(rawPage, 10);
  if (Number.isNaN(pageNumber) || pageNumber <= 1) {
    notFound();
  }

  const pagination = paginatePosts(locale, pageNumber);
  if (pageNumber > pagination.totalPages) {
    notFound();
  }

  const messages = await getMessages(locale);
  const t = createTranslator({ locale, namespace: "Pagination", messages });
  const basePath = locale === defaultLocale ? "/blog" : `/${locale}/blog`;
  const allPosts = getPostsByLocale(locale);

  return (
    <BlogLayoutView locale={locale}>
      <section className="flex flex-col gap-4 rounded-[2rem] border border-[#eadfcd]/70 bg-white/70 p-5 text-sm text-[#4b4139] shadow-[0_24px_70px_-40px_rgba(40,30,20,0.4)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7c6d5d]">
          {t("pageLabel", { page: pageNumber })}
        </p>
        <h1 className="text-[clamp(1.8rem,4.5vw,2.6rem)] font-semibold leading-tight text-[#2f2b26]">
          {t("archiveTitle", { page: pageNumber })}
        </h1>
        <p>{t("archiveDescription", { page: pageNumber })}</p>
      </section>

      <BlogExplorer
        enableSearch
        initialPosts={pagination.items}
        allPosts={allPosts}
        pagination={{ basePath, currentPage: pageNumber, totalPages: pagination.totalPages }}
      />
    </BlogLayoutView>
  );
}
