import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isDev = process.argv.includes("dev");

const loadVelite = new Function("specifier", "return import(specifier);");

if (!process.env.VELITE_STARTED && isDev) {
  process.env.VELITE_STARTED = "1";
  loadVelite("velite").then((mod: typeof import("velite")) => mod.build({ watch: true, clean: false }));
}

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const config: NextConfig = withNextIntl(nextConfig);

export default config;
