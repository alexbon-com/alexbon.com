"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/theme-context";
import { themes } from "@/lib/themes";

const THEME_COOKIE = "NEXT_THEME";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("ThemeToggle");
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const localizedThemes = useMemo(
    () =>
      themes.map((item) => ({
        ...item,
        label: t(`${item.id}.label`),
        description: t(`${item.id}.description`),
      })),
    [t],
  );

  const current = localizedThemes.find((item) => item.id === theme) ?? localizedThemes[0];
  const toggleLabel = t("ariaLabel");

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!listRef.current || !toggleRef.current) return;
      if (!listRef.current.contains(target) && !toggleRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="relative">
      <button
        type="button"
        ref={toggleRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={toggleLabel}
        className="nav-pill inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <span aria-hidden className="text-lg leading-none">
          {current.icon}
        </span>
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      <div
        ref={listRef}
        role="listbox"
        className={`theme-dropdown absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border bg-menu p-2 shadow-lg backdrop-blur transition-all duration-150 ${
          isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1">
          {localizedThemes.map((item) => {
            const isActive = item.id === theme;
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setTheme(item.id);
                  setIsOpen(false);
                  document.cookie = `${THEME_COOKIE}=${item.id}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
                }}
                className={`theme-option flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                  isActive ? "theme-option--active" : ""
                }`}
              >
                <span
                  className="theme-swatch"
                  aria-hidden
                  style={{
                    background: `linear-gradient(135deg, ${item.swatch[0]}, ${item.swatch[1]})`,
                  }}
                />
                <span className="flex flex-col">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-xs opacity-70">{item.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
