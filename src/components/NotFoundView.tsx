import type { Locale } from "@/i18n/config";
import type { TranslateFn } from "@/types/i18n";
import { buildPostTypePath } from "@/lib/post-types";
import { Link } from "@/navigation";

export function NotFoundView({ locale, t }: { locale: Locale; t: TranslateFn }) {
  const lines = [t("line1"), t("line2"), t("line3"), t("line4")];

  const actions = [
    { href: buildPostTypePath(locale, "article"), label: t("actions.articles") },
    { href: buildPostTypePath(locale, "note"), label: t("actions.notes") },
    { href: buildPostTypePath(locale, "story"), label: t("actions.stories") },
    { href: "/blog", label: t("actions.blog") },
    { href: "/about", label: t("actions.about") },
  ];

  return (
    <main className="mx-auto flex min-h-screen w-[92%] max-w-3xl flex-col justify-center gap-8 py-16 text-[#2f2b26]">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b39c7d]">{t("title")}</p>
        <h1 className="text-balance text-[clamp(2.6rem,8vw,4rem)] font-semibold leading-tight">
          {t("line1")}
        </h1>
      </header>

      <section className="flex flex-col gap-3 text-[clamp(1.05rem,3vw,1.3rem)] leading-relaxed text-[#4b4139]">
        {lines.slice(1).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#7c6d5d]">
          {t("prompt")}
        </p>
        <nav className="flex flex-col gap-3" aria-label={t("prompt")}>
          {actions.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              locale={locale}
              className="group inline-flex items-center gap-3 rounded-full border border-[#eadfcd]/70 px-5 py-3 text-sm font-semibold text-[#2f2b26] transition-colors hover:bg-[#f4eadb] hover:text-[#2f2b26]"
            >
              <span className="transition-transform group-hover:translate-x-1">{label}</span>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
