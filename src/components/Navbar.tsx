"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { languageLinks, type LocaleKey } from "@/content";
import { defaultLocale } from "@/i18n/config";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, usePathname } from "@/navigation";

interface NavbarProps {
  activeLocale: LocaleKey;
  brandName: string;
  tagline: string;
  alternatePaths?: Partial<Record<LocaleKey, string>>;
}

export function Navbar({ activeLocale, brandName, tagline, alternatePaths }: NavbarProps) {
  const t = useTranslations("Navbar");
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const languageButtonRef = useRef<HTMLButtonElement | null>(null);

  const currentLanguage = languageLinks.find((link) => link.locale === activeLocale) ?? languageLinks[0];
  const alternateLanguages = languageLinks.filter((link) => link.locale !== activeLocale);

  const appendSearchParams = (path: string) => {
    const search = searchParams.toString();
    if (!search || path.includes("?")) {
      return path;
    }

    if (path.includes("#")) {
      const [base, hash] = path.split("#");
      return `${base}?${search}#${hash}`;
    }

    return `${path}?${search}`;
  };

  const navItems = [
    { label: t("blog"), href: appendSearchParams("/") },
    { label: t("about"), href: appendSearchParams("/about") },
    { label: t("menu.searchLink"), href: appendSearchParams("/search") },
  ];

  const buildLocalePath = (targetLocale: LocaleKey) => {
    const alternatePath = alternatePaths?.[targetLocale];
    const basePath = alternatePath ? appendSearchParams(alternatePath) : appendSearchParams(pathname);
    return targetLocale === defaultLocale && basePath === "" ? "/" : basePath || "/";
  };

  useEffect(() => {
    if (!isLanguageMenuOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        languageMenuRef.current &&
        languageButtonRef.current &&
        !languageMenuRef.current.contains(target) &&
        !languageButtonRef.current.contains(target)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLanguageMenuOpen]);

  useEffect(() => {
    setIsLanguageMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      if (!next) {
        setIsLanguageMenuOpen(false);
      }
      return next;
    });
  };

  const mobileMenuLabel = t(isMobileMenuOpen ? "menu.close" : "menu.open");

  return (
    <header className="navbar-shell border-b shadow-md backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex w-full items-center justify-between gap-3 sm:flex-1">
            <h1 className="text-pretty text-left text-[clamp(1.25rem,4vw,2rem)] font-semibold leading-tight text-nav-heading">
              <Link
                href="/"
                aria-label={`${brandName}: ${tagline}`}
                className="transition-colors hover:text-accent focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                {tagline}
              </Link>
            </h1>

            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={isMobileMenuOpen}
              aria-controls="navbar-menu"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuLabel}
              className="nav-pill ml-auto inline-flex min-h-[44px] items-center justify-center gap-3 rounded-full border border-soft px-4 py-2 text-base font-semibold text-nav transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <span
                aria-hidden="true"
                className="relative block h-5 w-6"
              >
                <span
                  className={`absolute left-0 top-0 h-0.5 w-full rounded-full bg-current transition-transform duration-200 ${
                    isMobileMenuOpen ? "translate-y-2.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-opacity duration-150 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-200 ${
                    isMobileMenuOpen ? "-translate-y-2.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>

          <div className="relative flex w-full justify-end sm:w-auto">
            <div
              id="navbar-menu"
              className={`${
                isMobileMenuOpen ? "flex" : "hidden"
              } mt-3 w-full flex-col gap-5 rounded-[2rem] border border-soft bg-surface p-5 text-sm font-semibold text-nav shadow-lg sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-80 sm:border-soft/70 sm:bg-menu sm:p-6 sm:shadow-xl sm:backdrop-blur`}
            >
              <div className="flex w-full flex-col divide-y divide-soft/40">
                <nav className="w-full py-1">
                  <ul className="flex w-full flex-col divide-y divide-soft/40 text-center text-base font-semibold text-nav">
                    {navItems.map((item) => (
                      <li key={item.href} className="w-full py-3">
                        <Link
                          href={item.href}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsLanguageMenuOpen(false);
                          }}
                          className="nav-link inline-flex w-full min-h-[44px] items-center justify-center rounded-full border border-transparent px-5 py-2.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="flex w-full flex-col divide-y divide-soft/40 text-center">
                  <div className="flex justify-center py-4">
                    <ThemeToggle />
                  </div>

                  <div className="relative w-full py-4">
                    <button
                      type="button"
                      ref={languageButtonRef}
                      onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
                      aria-haspopup="listbox"
                      aria-expanded={isLanguageMenuOpen}
                      className="nav-pill inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      {currentLanguage.label}
                      <span
                        aria-hidden="true"
                        className={`transition-transform ${isLanguageMenuOpen ? "rotate-180" : "rotate-0"}`}
                      >
                        ▾
                      </span>
                    </button>

                    <div
                      ref={languageMenuRef}
                      role="listbox"
                      className={`theme-dropdown absolute left-0 top-full z-50 mt-2 w-full rounded-2xl border bg-menu p-1 shadow-lg backdrop-blur transition-all duration-150 ${
                        isLanguageMenuOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0"
                      }`}
                    >
                      {alternateLanguages.map((link) => (
                        <Link
                          key={link.locale}
                          href={buildLocalePath(link.locale)}
                          locale={link.locale}
                          onClick={() => {
                            setIsLanguageMenuOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="theme-option flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                        >
                          <span>{link.label}</span>
                          <span
                            aria-hidden
                            className={`size-2 rounded-full ${link.locale === activeLocale ? "bg-accent" : "bg-label-muted"}`}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
