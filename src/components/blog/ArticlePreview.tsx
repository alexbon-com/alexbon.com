"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/config";
import type { BlogPost } from "@/lib/blog";
import { getPostTypeLabel } from "@/lib/post-types";
import { Link } from "@/navigation";

interface ArticlePreviewProps {
  post: BlogPost;
}

export function ArticlePreview({ post }: ArticlePreviewProps) {
  const locale = useLocale() as Locale;
  const tBlog = useTranslations("Blog");
  const typeLabel = getPostTypeLabel(locale, post.type);
  const typeHref = `/blog/type/${post.type}`;
  const postHref = `/blog/${post.slug}`;
  const snippet = post.cardSnippet?.trim() || buildDefaultSnippet(post.summary || post.description || post.plainText || "");

  return (
    <article className="blog-card flex w-full flex-col gap-5 rounded-[2.5rem] border border-soft p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-8">
      <div className="flex items-center text-xs font-semibold uppercase tracking-[0.28em] text-muted">
        <Link href={typeHref} className="badge-soft inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.65rem] leading-none transition-colors hover:bg-[#f2993f]/90 hover:text-white">
          {typeLabel}
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-balance text-[clamp(1.45rem,4.5vw,2rem)] font-semibold leading-tight text-strong">
          <Link href={postHref} className="text-inherit transition-colors hover:text-accent">
            {post.title}
          </Link>
        </h3>
        {snippet && (
          <Link href={postHref} className="block whitespace-pre-line text-[clamp(1rem,3vw,1.12rem)] leading-relaxed text-primary transition-colors hover:text-accent">
            {snippet}
          </Link>
        )}
      </div>

      <div>
        <Link href={postHref} className="button-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5">
          {tBlog("readMore")}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

function buildDefaultSnippet(text: string, maxLength = 300) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";

  const segments = cleaned.split(/(?<=\.)\s+/).filter(Boolean);
  if (segments.length === 0) {
    return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1).trim()}…` : cleaned;
  }

  let snippet = segments[0];

  const emotionalMarkers = [/\b(но|однако|а\s)/i, /!+/, /\?+/];
  for (let i = 0; i < segments.length; i += 1) {
    snippet = segments.slice(0, i + 1).join(" ").trim();
    if (snippet.length > maxLength) {
      snippet = snippet.slice(0, maxLength);
      const lastSpace = snippet.lastIndexOf(" ");
      snippet = (lastSpace > 80 ? snippet.slice(0, lastSpace) : snippet).trim();
      return `${snippet}…`;
    }

    const current = segments[i];
    if (emotionalMarkers.some((marker) => marker.test(current))) {
      return snippet.length < cleaned.length ? `${snippet.trim()}…` : snippet;
    }
  }

  if (snippet.length > maxLength) {
    const trimmed = snippet.slice(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(" ");
    return `${(lastSpace > 80 ? trimmed.slice(0, lastSpace) : trimmed).trim()}…`;
  }

  if (snippet.length < cleaned.length) {
    return `${snippet.trim()}…`;
  }

  return snippet;
}
