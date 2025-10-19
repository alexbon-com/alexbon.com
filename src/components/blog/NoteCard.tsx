"use client";

import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/config";
import type { BlogPost } from "@/lib/blog";
import { getPostTypeLabel } from "@/lib/post-types";
import { Link } from "@/navigation";

interface NoteCardProps {
  post: BlogPost;
}

export function NoteCard({ post }: NoteCardProps) {
  const locale = useLocale() as Locale;
  const summary = post.cardSnippet?.trim() || post.summary || post.title;
  const typeLabel = getPostTypeLabel(locale, post.type);
  const typeHref = `/blog/type/${post.type}`;
  const postHref = `/blog/${post.slug}`;

  return (
    <article className="blog-card flex w-full flex-col gap-3 rounded-3xl border border-soft p-5 transition-transform duration-200 hover:-translate-y-0.5 sm:p-6">
      <div className="flex items-center text-xs font-semibold uppercase tracking-[0.28em] text-muted">
        <Link
          href={typeHref}
          className="badge-soft inline-flex items-center px-3 py-1 text-[0.65rem] leading-none transition-colors hover:bg-[#f2993f]/90 hover:text-white"
        >
          {typeLabel}
        </Link>
      </div>
      <h3 className="sr-only">{post.title}</h3>
      <p className="text-[clamp(1.1rem,3.2vw,1.3rem)] leading-relaxed text-strong">
        <Link href={postHref} className="text-inherit transition-colors hover:text-accent">
          {summary}
        </Link>
      </p>
    </article>
  );
}
