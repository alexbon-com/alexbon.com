import type { ReactNode } from "react";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/getMessages";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/contexts/theme-context";
import { DEFAULT_THEME, isThemeId } from "@/lib/themes";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
});

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

  let wrappedChildren = children;

  if (isDefaultLocaleTree) {
    const messages = await getMessages(defaultLocale);
    wrappedChildren = (
      <NextIntlClientProvider locale={defaultLocale} messages={messages} timeZone="Europe/Moscow">
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <html lang={locale} data-theme={initialTheme} suppressHydrationWarning>
      <head>
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
        <ThemeProvider initialTheme={initialTheme}>{wrappedChildren}</ThemeProvider>
      </body>
    </html>
  );
}
