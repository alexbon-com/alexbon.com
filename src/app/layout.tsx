import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/getMessages";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/contexts/theme-context";
import { DEFAULT_THEME, isThemeId } from "@/lib/themes";
import { SITE_URL } from "@/lib/seo";
import { LanguagePrompt } from "@/components/LanguagePrompt";

const FEED_LINKS = [
  {
    href: `${SITE_URL}/feed.xml`,
    type: "application/rss+xml",
    title: "Просто простір, щоб видихнути і розібратися",
    hreflang: "uk",
  },
  {
    href: `${SITE_URL}/feed.json`,
    type: "application/feed+json",
    title: "Просто простір, щоб видихнути і розібратися",
    hreflang: "uk",
  },
  {
    href: `${SITE_URL}/ru/feed.xml`,
    type: "application/rss+xml",
    title: "Просто место, чтобы выдохнуть и разобраться",
    hreflang: "ru",
  },
  {
    href: `${SITE_URL}/ru/feed.json`,
    type: "application/feed+json",
    title: "Просто место, чтобы выдохнуть и разобраться",
    hreflang: "ru",
  },
  {
    href: `${SITE_URL}/en/feed.xml`,
    type: "application/rss+xml",
    title: "Just a space to take a breath and figure things out",
    hreflang: "en",
  },
  {
    href: `${SITE_URL}/en/feed.json`,
    type: "application/feed+json",
    title: "Just a space to take a breath and figure things out",
    hreflang: "en",
  },
];

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
      "application/feed+json": `${SITE_URL}/feed.json`,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale?: string;
  }>;
};

function resolveLocale(locale?: string): Locale {
  if (!locale) {
    return defaultLocale;
  }
  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams?.locale);
  const isDefaultLocaleTree = !resolvedParams?.locale;
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("NEXT_THEME")?.value;
  const initialTheme = isThemeId(themeCookie) ? themeCookie : DEFAULT_THEME;
  let content: ReactNode = children;

  if (isDefaultLocaleTree) {
    const messages = await getMessages(defaultLocale);
    content = (
      <NextIntlClientProvider locale={defaultLocale} messages={messages} timeZone="Europe/Moscow">
        <LanguagePrompt />
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <html lang={locale} data-theme={initialTheme} suppressHydrationWarning>
      <head>
        {FEED_LINKS.map((link) => (
          <link
            key={`${link.type}-${link.hreflang}`}
            rel="alternate"
            type={link.type}
            title={link.title}
            href={link.href}
            hrefLang={link.hreflang}
          />
        ))}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem("NEXT_THEME");
                  var cookieMatch = document.cookie.match(/(?:^|; )NEXT_THEME=([^;]+)/);
                  var theme = stored || (cookieMatch ? decodeURIComponent(cookieMatch[1]) : "${initialTheme}");
                  if (theme) {
                    document.documentElement.dataset.theme = theme;
                  }
                } catch (_) {}
                document.documentElement.classList.add("js");
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider initialTheme={initialTheme}>
          {content}
        </ThemeProvider>
      </body>
    </html>
  );
}
