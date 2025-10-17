'use client';

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import type { BlogPost } from "@/lib/blog";

interface SearchPageContentProps {
  posts: BlogPost[];
  initialQuery?: string;
}

export function SearchPageContent({ posts, initialQuery }: SearchPageContentProps) {
  const t = useTranslations("Search");
  const initialPosts = useMemo(() => posts.slice(0, 18), [posts]);

  return (
    <div className="flex flex-col gap-8">
      <section className="section-card-strong flex flex-col gap-4 rounded-[2.5rem] border border-soft p-6 text-center shadow-card sm:p-10">
        <h1 className="text-balance text-[clamp(2.1rem,6vw,3.4rem)] font-semibold leading-tight text-strong">
          {t("heroTitle")}
        </h1>
        <p className="mx-auto max-w-2xl text-[clamp(1rem,3vw,1.2rem)] leading-relaxed text-primary">
          {t("heroDescription")}
        </p>
      </section>

      <BlogExplorer initialPosts={initialPosts} allPosts={posts} initialQuery={initialQuery} />
    </div>
  );
}
