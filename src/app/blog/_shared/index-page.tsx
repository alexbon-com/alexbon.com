import type { Metadata } from "next";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { JsonLd } from "@/components/JsonLd";
import { contentByLocale } from "@/content";
import { defaultLocale, type Locale } from "@/i18n/config";
import { getPostsByLocale, paginatePosts, type BlogPost } from "@/lib/blog";
import {
  DEFAULT_POST_IMAGE,
  PERSON_JOB_TITLES,
  PERSON_KNOWS_ABOUT,
  buildCanonicalUrl,
  buildLanguageAlternates,
  SITE_URL,
  localeToBcp47,
} from "@/lib/seo";

const FIRST_PAGE = 1;

interface BlogMetadataOptions {
  path?: string;
}

const BLOG_LABEL_BY_LOCALE: Record<Locale, string> = {
  ua: "Думки",
  ru: "Мысли",
  en: "Thoughts",
};

const BLOG_TOPICS_BY_LOCALE: Record<Locale, string[]> = {
  ua: [
    "Карти внутрішнього світу: глибокі статті про психологію, усвідомленість і будову нашої свідомості.",
    "Історії-дзеркала. Художні оповідання та психологічні притчі про зустріч із собою.",
    "Іскри та проблиски. Короткі нотатки й афоризми, що допомагають побачити звичне по-новому.",
  ],
  ru: [
    "Карты внутреннего мира: глубокие статьи о психологии, осознанности и устройстве нашего сознания.",
    "Истории-зеркала. Художественные рассказы и психологические притчи о встрече с собой.",
    "Искры и проблески. Короткие заметки и афоризмы, которые помогают увидеть привычное по-новому.",
  ],
  en: [
    "Inner World Maps: in-depth essays on psychology, mindfulness, and how our mind works.",
    "Mirror stories. Literary tales and psychological parables about meeting yourself.",
    "Sparks and glimmers. Short notes and aphorisms that help you see the familiar anew.",
  ],
};

const SOCIAL_PROFILES = ["https://www.facebook.com/mr.alexbon"];

function mapPostTypeToSchemaTypes(type: BlogPost["type"]) {
  if (type === "story") return ["BlogPosting", "ShortStory"] as const;
  if (type === "article") return ["BlogPosting", "Article"] as const;
  return ["BlogPosting", "SocialMediaPosting"] as const;
}

function buildBlogCollectionJsonLd(locale: Locale, heroTitle: string, heroDescription: string, posts: BlogPost[]) {
  const canonical = buildCanonicalUrl(locale, "/blog/");
  const inLanguage = localeToBcp47[locale] ?? locale;
  const aboutTopics = BLOG_TOPICS_BY_LOCALE[locale]?.map((topic) => ({
    "@type": "Thing",
    name: topic,
  }));
  const postEntries = posts.slice(0, 12).map((post) => {
    const image = post.image ?? DEFAULT_POST_IMAGE;
    const jobTitle = PERSON_JOB_TITLES[locale] ?? PERSON_JOB_TITLES[defaultLocale];
    const knowsAbout = PERSON_KNOWS_ABOUT[locale] ?? PERSON_KNOWS_ABOUT[defaultLocale];
    return {
      "@type": mapPostTypeToSchemaTypes(post.type),
      "@id": `${SITE_URL}${post.url}`,
      url: `${SITE_URL}${post.url}`,
      headline: post.title,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      keywords: post.tags,
      image,
      thumbnailUrl: image,
      author: {
        "@type": "Person",
        name: post.author,
        url: post.authorUrl ?? SITE_URL,
        sameAs: SOCIAL_PROFILES,
        ...(jobTitle ? { jobTitle } : {}),
        ...(knowsAbout ? { knowsAbout } : {}),
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: heroTitle,
    description: heroDescription,
    inLanguage,
    url: canonical,
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: {
      "@type": "Organization",
      name: "alexbon.com",
      url: SITE_URL,
      sameAs: SOCIAL_PROFILES,
    },
    creator: {
      "@type": "Person",
      name: "Алекс Бон",
      url: SITE_URL,
      sameAs: SOCIAL_PROFILES,
      jobTitle: locale === "en" ? "Psychologist and mindfulness guide" : locale === "ua" ? "Психолог і провідник усвідомленості" : "Психолог и проводник осознанности",
    },
    ...(aboutTopics ? { about: aboutTopics } : {}),
    genre: BLOG_TOPICS_BY_LOCALE[locale][0],
    isAccessibleForFree: true,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    ...(postEntries.length > 0 ? { blogPost: postEntries } : {}),
  };
}

function buildBlogBreadcrumbJsonLd(locale: Locale) {
  const homeName = locale === "en" ? "Home" : locale === "ua" ? "Головна" : "Главная";
  const homeUrl = locale === defaultLocale ? `${SITE_URL}/` : `${SITE_URL}/${locale}/`;
  const blogUrl = buildCanonicalUrl(locale, "/blog/");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeName,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: BLOG_LABEL_BY_LOCALE[locale],
        item: blogUrl,
      },
    ],
  };
}

export function getBlogIndexMetadata(locale: Locale, options: BlogMetadataOptions = {}): Metadata {
  const hero = contentByLocale[locale].blog;
  const path = options.path ?? "/blog/";

  return {
    title: hero.heroTitle,
    description: hero.heroDescription,
    alternates: {
      canonical: buildCanonicalUrl(locale, path),
      languages: buildLanguageAlternates(path),
      types: {
        "application/rss+xml": `${SITE_URL}${locale === defaultLocale ? "" : `/${locale}`}/feed.xml`,
        "application/feed+json": `${SITE_URL}${locale === defaultLocale ? "" : `/${locale}`}/feed.json`,
      },
    },
  };
}

export function BlogIndexView({
  locale,
  basePath: basePathOverride,
  initialQuery,
}: {
  locale: Locale;
  basePath?: string;
  initialQuery?: string;
}) {
  const pagination = paginatePosts(locale, FIRST_PAGE);
  const allPosts = getPostsByLocale(locale);
  const hero = contentByLocale[locale].blog;
  const basePath = basePathOverride ?? (locale === defaultLocale ? "/blog" : `/${locale}/blog`);
  const collectionSchema = buildBlogCollectionJsonLd(locale, hero.heroTitle, hero.heroDescription, allPosts);
  const breadcrumbSchema = buildBlogBreadcrumbJsonLd(locale);

  return (
    <>
      <JsonLd data={[collectionSchema, breadcrumbSchema]} />
      <section className="section-card-strong flex flex-col gap-6 rounded-[2.5rem] border border-soft p-6 text-center shadow-card sm:p-10">
        <span className="badge-soft mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-muted">
          {hero.badge}
        </span>
        <h1 className="text-balance text-[clamp(2.4rem,6.5vw,3.8rem)] font-semibold leading-tight text-strong">
          {hero.heroTitle}
        </h1>
        <p className="mx-auto max-w-3xl text-[clamp(1.05rem,3.2vw,1.3rem)] leading-relaxed text-primary">
          {hero.heroDescription}
        </p>
      </section>

      <BlogExplorer
        initialPosts={pagination.items}
        allPosts={allPosts}
        pagination={{ basePath, currentPage: FIRST_PAGE, totalPages: pagination.totalPages }}
        initialQuery={initialQuery}
      />
    </>
  );
}
