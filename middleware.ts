import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "./src/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasLocalePrefix = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  const storedLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const preferredLocale = locales.find((locale) => locale === storedLocale);

  if (
    !hasLocalePrefix &&
    preferredLocale &&
    preferredLocale !== defaultLocale
  ) {
    const url = request.nextUrl.clone();
    const pathSuffix = pathname === "/" ? "" : pathname;
    url.pathname = `/${preferredLocale}${pathSuffix}`;

    return NextResponse.redirect(url);
  }

  const response = intlMiddleware(request);

  const matchedLocale = locales.find((locale) => {
    if (locale === defaultLocale) {
      return false;
    }
    return pathname === `/${locale}` || pathname.startsWith(`/${locale}/`);
  });

  if (matchedLocale) {
    response.cookies.set(LOCALE_COOKIE, matchedLocale, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  } else if (!request.cookies.get(LOCALE_COOKIE)) {
    response.cookies.set(LOCALE_COOKIE, defaultLocale, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
