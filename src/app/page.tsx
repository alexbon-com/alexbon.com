import type { Metadata } from "next";
import { BlogLayoutView } from "@/app/blog/_shared/layout";
import { BlogIndexView, getBlogIndexMetadata } from "@/app/blog/_shared/index-page";
import { defaultLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export const generateMetadata = async (): Promise<Metadata> =>
  getBlogIndexMetadata(defaultLocale, { path: "/" });

export default function RootPage() {
  return (
    <BlogLayoutView locale={defaultLocale}>
      <BlogIndexView locale={defaultLocale} />
    </BlogLayoutView>
  );
}
