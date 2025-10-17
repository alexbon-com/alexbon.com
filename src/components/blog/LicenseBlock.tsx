'use client';

import { useTranslations } from "next-intl";

interface LicenseBlockProps {
  className?: string;
}

export function LicenseBlock({ className = "" }: LicenseBlockProps) {
  const t = useTranslations("License");

  return (
    <aside className={`blog-card flex flex-col gap-3 rounded-3xl border border-soft p-5 text-sm leading-relaxed text-primary ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">
        {t("heading")}
      </p>
      <p>
        {t.rich("body", {
          license: (chunks) => (
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              className="font-semibold text-accent underline decoration-dotted underline-offset-4 transition-colors hover:text-accent"
              rel="noopener noreferrer"
              target="_blank"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </aside>
  );
}
