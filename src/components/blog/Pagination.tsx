"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

interface PaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  getHref?: (page: number) => string;
}

export function Pagination({ basePath, currentPage, totalPages, getHref }: PaginationProps) {
  const t = useTranslations("Pagination");

  if (totalPages <= 1) {
    return null;
  }

  const normalizedBasePath =
    basePath === "/"
      ? "/"
      : basePath === ""
        ? ""
        : basePath.endsWith("/") && basePath !== "/"
          ? basePath.slice(0, -1)
          : basePath;

  const hrefFor = (page: number) => {
    if (getHref) return getHref(page);
    if (page === 1) {
      return normalizedBasePath === "" ? "/" : normalizedBasePath || "/";
    }
    return normalizedBasePath === "" || normalizedBasePath === "/"
      ? `/page/${page}`
      : `${normalizedBasePath}/page/${page}`;
  };

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className="flex items-center justify-between rounded-full border border-[#eadfcd]/70 bg-white/80 px-4 py-2 text-sm font-semibold text-[#3f3831] shadow-[0_18px_48px_-32px_rgba(40,30,20,0.35)]">
      {hasPrev ? (
        <Link
          href={hrefFor(currentPage - 1)}
          className="flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-[#f4eadb] hover:text-[#2f2b26]"
        >
          ← {t("previous")}
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-full px-3 py-2 text-[#b2a698] opacity-70">←</span>
      )}
      <span className="text-xs uppercase tracking-[0.3em] text-[#7c6d5d]">
        {t("pageSummary", { page: currentPage, total: totalPages })}
      </span>
      {hasNext ? (
        <Link
          href={hrefFor(currentPage + 1)}
          className="flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-[#f4eadb] hover:text-[#2f2b26]"
        >
          {t("next")} →
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-full px-3 py-2 text-[#b2a698] opacity-70">→</span>
      )}
    </nav>
  );
}
