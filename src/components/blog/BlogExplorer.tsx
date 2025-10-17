'use client';

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";
import { useTranslations } from "next-intl";
import { ArticlePreview } from "@/components/blog/ArticlePreview";
import { NoteCard } from "@/components/blog/NoteCard";
import { Pagination } from "@/components/blog/Pagination";
import type { BlogPost } from "@/lib/blog";

interface BlogExplorerProps {
  initialPosts: BlogPost[];
  allPosts: BlogPost[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    basePath: string;
    getHref?: (page: number) => string;
  };
  enableSearch?: boolean;
  initialQuery?: string;
}

const fuseOptions: IFuseOptions<BlogPost> = {
  includeScore: true,
  threshold: 0.32,
  keys: ["title", "description", "tags", "searchContent"],
};

export function BlogExplorer({
  initialPosts,
  allPosts,
  pagination,
  enableSearch = true,
  initialQuery,
}: BlogExplorerProps) {
  const [query, setQuery] = useState(() => initialQuery?.trim() ?? "");
  const tSearch = useTranslations("Search");

  const fuse = useMemo(() => (enableSearch ? new Fuse(allPosts, fuseOptions) : null), [allPosts, enableSearch]);

  const trimmedQuery = query.trim();
  const isSearching = enableSearch && trimmedQuery.length > 0;

  const filtered = useMemo(() => {
    if (!isSearching || !fuse) return initialPosts;
    return fuse.search(trimmedQuery).map((result) => result.item);
  }, [fuse, initialPosts, isSearching, trimmedQuery]);

  return (
    <section className="flex flex-col gap-6">
      {enableSearch && (
        <>
          <div className="js-only blog-card flex flex-col gap-3 rounded-[2rem] border border-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6">
            <label className="flex w-full flex-col gap-2 text-sm font-semibold text-primary sm:flex-1">
              {tSearch("label")}
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder={tSearch("placeholder")}
                className="w-full rounded-full border border-soft bg-surface px-4 py-3 text-base font-normal text-strong shadow-inner outline-none transition focus:border-accent focus:text-strong"
              />
            </label>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="nav-pill inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-2.5 text-base font-semibold transition-colors"
              disabled={!isSearching}
            >
              {tSearch("reset")}
            </button>
          </div>
          <noscript>
            <p className="text-xs text-muted">{tSearch("noscript")}</p>
          </noscript>
        </>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((post) =>
            post.type === "note" ? <NoteCard key={post.slug} post={post} /> : <ArticlePreview key={post.slug} post={post} />,
          )
        ) : (
          <div className="blog-card col-span-full flex flex-col items-center gap-3 rounded-[2rem] border border-soft p-10 text-center text-primary">
            <p className="text-xl font-semibold text-strong">{tSearch("empty")}</p>
            <p className="text-sm">{tSearch("emptyDetails")}</p>
          </div>
        )}
      </div>

      {!isSearching && pagination && (
        <Pagination
          basePath={pagination.basePath}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          getHref={pagination.getHref}
        />
      )}
    </section>
  );
}
