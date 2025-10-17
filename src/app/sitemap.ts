import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";
import { getAllPosts, getAllTags, paginatePostsByTag, POSTS_PER_PAGE } from "@/lib/blog";

const SITE_URL = "https://alexbon.com";

export const revalidate = 3600;
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = locale === defaultLocale ? "" : `/${locale}`;
    const homeUrl = locale === defaultLocale ? `${SITE_URL}/` : `${SITE_URL}${prefix}/`;

    entries.push({
      url: homeUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: locale === defaultLocale ? 1 : 0.9,
    });

    const blogIndexUrl = `${SITE_URL}${prefix}/blog/`;
    entries.push({
      url: blogIndexUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: locale === defaultLocale ? 0.8 : 0.75,
    });

    const searchUrl = `${SITE_URL}${prefix}/search/`;
    entries.push({
      url: searchUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: locale === defaultLocale ? 0.75 : 0.7,
    });

    const posts = getAllPosts(locale);
    const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

    for (let page = 2; page <= totalPages; page += 1) {
      entries.push({
        url: `${SITE_URL}${prefix}/blog/page/${page}/`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}${prefix}/blog/${post.slug}/`,
        lastModified: new Date(post.updatedAt ?? post.publishedAt),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }

    const tags = getAllTags(locale);
    for (const tag of tags) {
      const encoded = encodeURIComponent(tag);
      const baseTagUrl = `${SITE_URL}${prefix}/blog/tag/${encoded}/`;

      entries.push({
        url: baseTagUrl,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });

      const pagination = paginatePostsByTag(locale, tag, 1);
      for (let page = 2; page <= pagination.totalPages; page += 1) {
        entries.push({
          url: `${SITE_URL}${prefix}/blog/tag/${encoded}/page/${page}/`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
