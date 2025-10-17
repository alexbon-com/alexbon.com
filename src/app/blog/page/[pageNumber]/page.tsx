import type { Metadata } from "next";
import { createTranslator } from "use-intl/core";
import { notFound } from "next/navigation";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { defaultLocale, locales } from "@/i18n/config";
import { getPostsByLocale, paginatePosts } from "@/lib/blog";
import { getMessages } from "@/i18n/getMessages";
import { buildCanonicalUrl, buildLanguageAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Params = { pageNumber: string };

export const generateMetadata = async ({ params }: { params: Promise<Params> }): Promise<Metadata> => {
  const { pageNumber: rawPage } = await params;
  const pageNumber = Number.parseInt(rawPage, 10);
  if (Number.isNaN(pageNumber) || pageNumber <= 1) {
    return {};
  }

  const messages = await getMessages(defaultLocale);
  const t = createTranslator({ locale: defaultLocale, namespace: "Pagination", messages });
  const path = `/blog/page/${pageNumber}/`;
  const canonical = buildCanonicalUrl(defaultLocale, path);
  const availableLocales = locales.filter((locale) => {
    const { totalPages } = paginatePosts(locale, 1);
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
};

export default async function BlogPageNumberDefault({ params }: { params: Promise<Params> }) {
  const { pageNumber: rawPage } = await params;
  const pageNumber = Number.parseInt(rawPage, 10);
  if (Number.isNaN(pageNumber) || pageNumber <= 1) {
    notFound();
  }

  const pagination = paginatePosts(defaultLocale, pageNumber);
  if (pageNumber > pagination.totalPages) {
    notFound();
  }

  const messages = await getMessages(defaultLocale);
  const t = createTranslator({ locale: defaultLocale, namespace: "Pagination", messages });
  const allPosts = getPostsByLocale(defaultLocale);

  return (
    <BlogLayoutView locale={defaultLocale}>
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
        pagination={{ basePath: "/blog", currentPage: pageNumber, totalPages: pagination.totalPages }}
      />
    </BlogLayoutView>
  );
}
