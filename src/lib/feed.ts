import { contentByLocale } from "@/content";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getPostsByLocale } from "@/lib/blog";
import { DEFAULT_POST_IMAGE, SITE_URL, buildCanonicalUrl, localeToBcp47 } from "@/lib/seo";

const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

function resolveLocale(locale: string): Locale | null {
  return locales.includes(locale as Locale) ? (locale as Locale) : null;
}

function getLocalePrefix(locale: Locale): string {
  return locale === defaultLocale ? "" : `/${locale}`;
}

function getFeedTitle(locale: Locale): string {
  return contentByLocale[locale].tagline;
}

function getFeedDescription(locale: Locale): string {
  return contentByLocale[locale].blog.heroDescription;
}

function getFeedMetadata(locale: Locale) {
  const prefix = getLocalePrefix(locale);
  const feedJsonUrl = `${SITE_URL}${prefix}/feed.json`;
  const homePageUrl = buildCanonicalUrl(locale, "/blog/");
  const language = localeToBcp47[locale] ?? locale;
  const title = getFeedTitle(locale);
  const description = getFeedDescription(locale);

  return {
    feedJsonUrl,
    homePageUrl,
    language,
    title,
    description,
  };
}

function mapPostToFeedItem(locale: Locale) {
  const posts = getPostsByLocale(locale);

  return posts.map((post) => {
    const url = `${SITE_URL}${post.url}`;
    const image = post.image ?? DEFAULT_POST_IMAGE;

    return {
      id: url,
      url,
      title: post.title,
      content_text: post.description ?? post.summary ?? post.searchContent,
      language: localeToBcp47[post.locale as Locale] ?? post.locale,
      date_published: post.publishedAt,
      date_modified: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
      authors: [
        {
          name: post.author,
          url: post.authorUrl,
        },
      ],
      _license: LICENSE_URL,
      image,
    };
  });
}

export function buildJsonFeed(locale: Locale) {
  const { feedJsonUrl, homePageUrl, language, title, description } = getFeedMetadata(locale);
  const items = mapPostToFeedItem(locale);

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title,
    home_page_url: homePageUrl,
    feed_url: feedJsonUrl,
    description,
    language,
    authors: [
      {
        name: "Alex Bon",
        url: SITE_URL,
      },
    ],
    icon: DEFAULT_POST_IMAGE,
    favicon: `${SITE_URL}/favicon.ico`,
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate",
    },
  });
}

export function buildRssFeed(locale: Locale) {
  const { homePageUrl, language, title, description } = getFeedMetadata(locale);
  const items = mapPostToFeedItem(locale);

  const rssItems = items
    .map((item) => {
      const pubDate = new Date(item.date_published).toUTCString();
      const updated = new Date(item.date_modified).toUTCString();
      const categories = item.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("");
      const author = item.authors[0];
      const descriptionCdata = escapeCdata(item.content_text ?? "");
      const image = item.image ? `<enclosure url="${escapeXml(item.image)}" length="0" type="image/webp" />` : "";

      return `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${item.url}</link>
  <guid>${item.id}</guid>
  <pubDate>${pubDate}</pubDate>
  <lastBuildDate>${updated}</lastBuildDate>
  <description><![CDATA[${descriptionCdata}]]></description>
  <author>${escapeXml(author.name)} (${escapeXml(author.url ?? SITE_URL)})</author>
  <source url="${LICENSE_URL}">CC BY 4.0</source>
  <dc:language>${item.language}</dc:language>
  ${categories}
  ${image}
</item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${homePageUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>${language}</language>
    <copyright>CC BY 4.0</copyright>
    <managingEditor>Alex Bon</managingEditor>
    <webMaster>Alex Bon</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${DEFAULT_POST_IMAGE}</url>
      <title>${escapeXml(title)}</title>
      <link>${homePageUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate",
    },
  });
}

export function resolveFeedLocale(rawLocale?: string): Locale {
  if (!rawLocale) return defaultLocale;
  const resolved = resolveLocale(rawLocale);
  return resolved ?? defaultLocale;
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeCdata(value: string) {
  return value.replace(/]]>/g, "]]]]><![CDATA[>");
}
