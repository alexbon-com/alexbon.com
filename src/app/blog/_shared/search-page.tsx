import type { Metadata } from "next";
import { SearchPageContent } from "@/components/blog/SearchPageContent";
import type { Locale } from "@/i18n/config";
import { getPostsByLocale } from "@/lib/blog";
import { buildCanonicalUrl, buildLanguageAlternates } from "@/lib/seo";

const SEARCH_PAGE_PATH = "/search/";

const SEARCH_TITLE_BY_LOCALE: Record<Locale, string> = {
  ua: "Пошук",
  ru: "Поиск",
  en: "Search",
};

const SEARCH_DESCRIPTION_BY_LOCALE: Record<Locale, string> = {
  ua: "Досліджуйте архів статей, історій та нотаток за ключовими словами.",
  ru: "Находите статьи, истории и заметки по ключевым словам.",
  en: "Explore articles, stories, and notes by keyword.",
};

export function getSearchPageMetadata(locale: Locale): Metadata {
  const canonical = buildCanonicalUrl(locale, SEARCH_PAGE_PATH);

  return {
    title: SEARCH_TITLE_BY_LOCALE[locale],
    description: SEARCH_DESCRIPTION_BY_LOCALE[locale],
    alternates: {
      canonical,
      languages: buildLanguageAlternates(SEARCH_PAGE_PATH),
    },
  };
}

export function SearchPageView({ locale, initialQuery }: { locale: Locale; initialQuery?: string }) {
  const posts = getPostsByLocale(locale);

  return <SearchPageContent posts={posts} initialQuery={initialQuery} />;
}
