import { getAllPosts } from "@/lib/blog";
import { SITE_URL, localeToBcp47 } from "@/lib/seo";

const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

export const revalidate = 3600;
export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const pubDate = new Date(post.publishedAt).toUTCString();
      const updated = new Date(post.updatedAt ?? post.publishedAt).toUTCString();
      const postUrl = `${SITE_URL}${post.url}`;
      const categories = post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("");
      const language = localeToBcp47[post.locale] ?? post.locale;

      const description = escapeCdata(post.description ?? post.searchContent);

      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${postUrl}</link>
  <guid>${postUrl}</guid>
  <pubDate>${pubDate}</pubDate>
  <lastBuildDate>${updated}</lastBuildDate>
  <description><![CDATA[${description}]]></description>
  <author>${escapeXml(post.author)} (${escapeXml(post.authorUrl)})</author>
  <source url="${LICENSE_URL}">CC BY 4.0</source>
  <dc:language>${language}</dc:language>
  ${categories}
</item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Мысли Алекс Бон</title>
    <link>${SITE_URL}/blog/</link>
    <description>«Мысли» — тексты о внимательности к себе, проживании сложных периодов и бережном общении.</description>
    <language>mul</language>
    <copyright>CC BY 4.0</copyright>
    <managingEditor>Алекс Бон</managingEditor>
    <webMaster>Алекс Бон</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate",
    },
  });
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeCdata(value: string) {
  return value.replace(/]]>/g, "]]]]><![CDATA[>");
}
