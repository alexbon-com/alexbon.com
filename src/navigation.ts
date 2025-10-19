import { createNavigation } from "next-intl/navigation";
import { defaultLocale, locales } from "@/i18n/config";

export const { Link, useRouter, usePathname, redirect, permanentRedirect, getPathname } = createNavigation({
  locales,
  defaultLocale,
});
