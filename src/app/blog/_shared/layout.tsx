import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { contentByLocale, type LocaleKey } from "@/content";
import type { Locale } from "@/i18n/config";

const container = "mx-auto w-[92%] max-w-6xl px-4 sm:px-6";

export function BlogLayoutView({
  locale,
  alternatePaths,
  children,
}: {
  locale: Locale;
  alternatePaths?: Partial<Record<LocaleKey, string>>;
  children: ReactNode;
}) {
  const base = contentByLocale[locale];

  return (
    <div className="relative min-h-screen overflow-hidden text-strong">
      <div className="relative z-20">
        <Navbar
          activeLocale={locale}
          brandName={base.brandName}
          tagline={base.tagline}
          alternatePaths={alternatePaths}
        />
      </div>

      <main className={`relative z-10 flex flex-col gap-10 pb-16 pt-6 sm:pt-10 ${container}`}>{children}</main>
    </div>
  );
}
