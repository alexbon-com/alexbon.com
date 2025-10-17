import { getAllPosts } from "@/lib/blog";
import { SITE_URL, localeToBcp47 } from "@/lib/seo";

const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

export const revalidate = 3600;
export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Мысли Алекс Бон",
    home_page_url: `${SITE_URL}/blog/`,
    feed_url: `${SITE_URL}/feed.json`,
    description:
      "Обновления раздела «Мысли»: тексты о внимательности к себе, проживании сложных периодов и бережном общении.",
    language: "mul",
    authors: [
      {
        name: "Алекс Бон",
        url: SITE_URL,
      },
    ],
    icon: `${SITE_URL}/favicon.ico`,
    favicon: `${SITE_URL}/favicon.ico`,
    items: posts.map((post) => ({
      id: `${SITE_URL}${post.url}/`,
      url: `${SITE_URL}${post.url}/`,
      title: post.title,
      content_text: post.description ?? post.searchContent,
      language: localeToBcp47[post.locale] ?? post.locale,
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
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate",
    },
  });
}
