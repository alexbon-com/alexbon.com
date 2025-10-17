import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineCollection, defineConfig, s } from "velite";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { DEFAULT_POST_IMAGE, SITE_URL, localeToBcp47 } from "@/lib/seo";

const GITHUB_CONTENT_BASE_URL = "https://github.com/alexbon-com/alexbon.com/blob/main/content";
const GITHUB_RAW_CONTENT_BASE_URL = "https://raw.githubusercontent.com/alexbon-com/alexbon.com/main/content";

const ARTICLE_SECTION_BY_LOCALE: Record<Locale, string> = {
  ua: "Карти внутрішнього світу: глибокі статті про психологію, усвідомленість і будову нашої свідомості.",
  ru: "Карты внутреннего мира: глубокие статьи о психологии, осознанности и устройстве нашего сознания.",
  en: "Inner World Maps: in-depth essays on psychology, mindfulness, and how our mind works.",
};

const NOTE_SECTION_BY_LOCALE: Record<Locale, string> = {
  ua: "Іскри та проблиски. Короткі нотатки й афоризми, що допомагають побачити звичне по-новому.",
  ru: "Искры и проблески. Короткие заметки и афоризмы, которые помогают увидеть привычное по-новому.",
  en: "Sparks and glimmers. Short notes and aphorisms that help you see the familiar anew.",
};

const STORY_GENRES_BY_LOCALE: Record<Locale, string[]> = {
  ua: ["Історії-дзеркала. Художні оповідання та психологічні притчі про зустріч із собою."],
  ru: ["Истории-зеркала. Художественные рассказы и психологические притчи о встрече с собой."],
  en: ["Mirror stories. Literary tales and psychological parables about meeting yourself."],
};


const posts = defineCollection({
  name: "Post",
  pattern: ["{ru,ua,en}/{articles,notes,stories}/*.mdx"],
  schema: s
    .object({
      title: s.string().default(""),
      type: s.enum(["note", "article", "story"]).default("note"),
      description: s.string().optional(),
      canonical: s.string().optional(),
      archived: s.string().optional(),
      publishedAt: s.isodate(),
      updatedAt: s.isodate().optional(),
      tags: s.array(s.string()).default([]),
      author: s.string().default("Alex Bon"),
      authorUrl: s.string().default("https://alexbon.com"),
      license: s.string().default("CC BY 4.0"),
      cardSnippet: s.string().optional(),
      image: s.string().optional(),
      translationGroup: s.string().optional(),
      body: s.mdx(),
      raw: s.raw(),
      toc: s.toc().optional(),
      sourcePath: s.path(),
    })
    .transform((doc) => {
      const {
        sourcePath,
        raw,
      type: frontmatterType,
      translationGroup: frontmatterTranslationGroup,
      title: frontmatterTitle = "",
      ...rest
    } = doc;
      const segments = sourcePath.split("/");
      const [localeSegment, collectionSegment, fileName] =
        segments.length >= 3 ? segments : [defaultLocale, "", segments.at(-1) ?? ""];
      const locale = locales.includes(localeSegment as Locale) ? (localeSegment as Locale) : defaultLocale;
      const collection: "articles" | "notes" | "stories" =
        collectionSegment === "articles" || collectionSegment === "stories" ? (collectionSegment as "articles" | "stories") : "notes";
      const resolvedType =
        collection === "articles"
          ? "article"
          : collection === "stories"
            ? "story"
            : frontmatterType ?? "note";
      const rawSlug = (fileName ?? "").replace(/\.mdx?$/i, "");
      const slug = rawSlug.length > 0 ? rawSlug : sourcePath.replace(/\.mdx?$/i, "");
      const localizedPath = locale === defaultLocale ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
      const canonical = (doc.canonical ?? "").trim() || `${SITE_URL}${localizedPath}`;
      const archived = (doc.archived ?? "").trim() || buildGithubArchiveUrl(sourcePath);
      const plainText = createPlainText(raw);
      const description = (doc.description ?? "").trim() || createDescription(plainText, 160);
      const firstSentence = extractFirstSentence(plainText);
      const resolvedTitle = frontmatterTitle.trim() || firstSentence || slug;
      const cardSnippet = cleanCardSnippet(doc.cardSnippet);
      const translationGroup = (frontmatterTranslationGroup ?? "").trim() || slug;

      return {
        ...rest,
        title: resolvedTitle,
        description,
        canonical,
        archived,
        type: resolvedType,
        collection,
        raw,
        plainText,
        summary: firstSentence || description,
        slug,
        locale,
        url: localizedPath,
        translationGroup,
        sourcePath,
        rawUrl: buildGithubRawUrl(sourcePath),
        author: doc.author,
        license: doc.license,
        cardSnippet,
        jsonLd: buildJsonLd(
          {
            ...rest,
            title: resolvedTitle,
            description,
            type: resolvedType,
            collection,
            canonical,
            archived,
            license: doc.license,
          },
          slug,
          locale,
        ),
        searchContent: createSearchContent(raw),
      };
    }),
});

const pages = defineCollection({
  name: "Page",
  pattern: ["{ru,ua,en}/pages/*.mdx"],
  schema: s
    .object({
      title: s.string().default(""),
      description: s.string().optional(),
      canonical: s.string().optional(),
      archived: s.string().optional(),
      author: s.string().default("Alex Bon"),
      authorUrl: s.string().default("https://alexbon.com"),
      license: s.string().default("CC BY 4.0"),
      cardSnippet: s.string().optional(),
      body: s.mdx(),
      raw: s.raw(),
      sourcePath: s.path(),
    })
    .transform((doc) => {
      const { sourcePath, raw, title, description: frontDescription, canonical: frontCanonical, archived: frontArchived } = doc;
      const segments = sourcePath.split("/");
      const [localeSegment, , fileName] =
        segments.length >= 3 ? segments : [defaultLocale, "", segments.at(-1) ?? "page"];
      const locale = locales.includes(localeSegment as Locale) ? (localeSegment as Locale) : defaultLocale;
      const rawSlug = (fileName ?? "").replace(/\.mdx?$/i, "");
      const slug = rawSlug.length > 0 ? rawSlug : sourcePath.replace(/\.mdx?$/i, "");
      const localizedPath = locale === defaultLocale ? `/${slug}` : `/${locale}/${slug}`;
      const canonical = (frontCanonical ?? "").trim() || `${SITE_URL}${localizedPath}`;
      const archived = (frontArchived ?? "").trim() || buildGithubArchiveUrl(sourcePath);
      const plainText = createPlainText(raw);
      const computedDescription = createDescription(plainText, 160);

      return {
        title: title.trim() || slug,
        description: (frontDescription ?? "").trim() || computedDescription,
        author: doc.author,
        authorUrl: doc.authorUrl,
        license: doc.license,
        canonical,
        archived,
        sourcePath,
        rawUrl: buildGithubRawUrl(sourcePath),
        cardSnippet: cleanCardSnippet(doc.cardSnippet),
        raw,
        plainText,
        slug,
        locale,
        url: localizedPath,
        jsonLd: buildPageJsonLd(
          {
            title: title.trim() || slug,
            description: (frontDescription ?? "").trim() || computedDescription,
            author: doc.author,
            authorUrl: doc.authorUrl,
            license: doc.license,
            canonical,
            archived,
          },
          slug,
          locale,
        ),
      };
    }),
});

function buildJsonLd(
  doc: {
    title: string;
    type: "note" | "article" | "story";
    description?: string;
    canonical?: string;
    archived?: string;
    publishedAt: string;
    updatedAt?: string;
    author: string;
    authorUrl: string;
    license: string;
    tags: string[];
    image?: string;
    collection: "articles" | "notes" | "stories";
  },
  slug: string,
  locale: Locale,
) {
  const siteUrl = SITE_URL;
  const path = locale === defaultLocale ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
  const image = doc.image ?? DEFAULT_POST_IMAGE;
  const collectionUrl = locale === defaultLocale ? `${siteUrl}/blog/` : `${siteUrl}/${locale}/blog/`;
  const licenseUrl = doc.license.startsWith("http")
    ? doc.license
    : "https://creativecommons.org/licenses/by/4.0/";
  const base = {
    "@context": "https://schema.org",
    license: licenseUrl,
    author: {
      "@type": "Person",
      name: doc.author,
      url: doc.authorUrl,
      sameAs: ["https://www.facebook.com/mr.alexbon"],
    },
    publisher: {
      "@type": "Organization",
      name: "alexbon.com",
      url: siteUrl,
      sameAs: ["https://www.facebook.com/mr.alexbon"],
    },
    headline: doc.title,
    datePublished: doc.publishedAt,
    dateModified: doc.updatedAt ?? doc.publishedAt,
    keywords: doc.tags,
    inLanguage: localeToBcp47[locale] ?? locale,
    url: doc.canonical ?? `${siteUrl}${path}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}${path}`,
    },
    image,
    thumbnailUrl: image,
    isPartOf: collectionUrl,
    ...(doc.archived ? { sameAs: [doc.archived] } : {}),
  };

  switch (doc.type) {
    case "article":
      return {
        ...base,
        "@type": "Article",
        description: doc.description,
        articleSection: ARTICLE_SECTION_BY_LOCALE[locale],
      };
    case "story":
      return {
        ...base,
        "@type": "ShortStory",
        description: doc.description,
        genre: STORY_GENRES_BY_LOCALE[locale],
        isFamilyFriendly: true,
      };
    default:
      return {
        ...base,
        "@type": "SocialMediaPosting",
        description: doc.description,
        articleSection: NOTE_SECTION_BY_LOCALE[locale],
      };
}

}

function buildPageJsonLd(
  doc: {
    title: string;
    description?: string;
    canonical?: string;
    archived?: string;
    author: string;
    authorUrl: string;
    license: string;
  },
  slug: string,
  locale: Locale,
) {
  const siteUrl = SITE_URL;
  const path = locale === defaultLocale ? `/${slug}` : `/${locale}/${slug}`;
  const licenseUrl = doc.license.startsWith("http")
    ? doc.license
    : "https://creativecommons.org/licenses/by/4.0/";

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: doc.title,
    description: doc.description,
    url: doc.canonical ?? `${siteUrl}${path}`,
    inLanguage: localeToBcp47[locale] ?? locale,
    license: licenseUrl,
    author: {
      "@type": "Person",
      name: doc.author,
      url: doc.authorUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}${path}`,
    },
    ...(doc.archived ? { sameAs: [doc.archived] } : {}),
  };
}

function createSearchContent(raw: string) {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_>#]/g, " ")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);
}

function normalizeContentPath(sourcePath: string) {
  const trimmed = sourcePath.startsWith("/") ? sourcePath.slice(1) : sourcePath;
  if (trimmed.endsWith(".mdx") || trimmed.endsWith(".md")) {
    return trimmed;
  }
  return `${trimmed}.mdx`;
}

function buildGithubArchiveUrl(sourcePath: string) {
  return `${GITHUB_CONTENT_BASE_URL}/${normalizeContentPath(sourcePath)}`;
}

function buildGithubRawUrl(sourcePath: string) {
  return `${GITHUB_RAW_CONTENT_BASE_URL}/${normalizeContentPath(sourcePath)}`;
}

function createPlainText(raw: string) {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`+/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[*_~>#]+/g, " ")
    .replace(/-{3,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createDescription(text: string, limit: number) {
  if (!text) return "";
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit - 3).trimEnd()}...`;
}

function extractFirstSentence(text: string) {
  if (!text) return "";
  const sentenceMatch = text.match(/(.+?[.!?])(\s|$)/);
  return sentenceMatch ? sentenceMatch[1].trim() : text.trim();
}

function cleanCardSnippet(snippet?: string) {
  if (!snippet) return "";
  return snippet
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    clean: true,
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["heading-anchor"],
          },
        },
      ],
    ],
  },
  collections: {
    posts,
    pages,
  },
});
