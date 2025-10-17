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

const rawConfig = withNextIntl(nextConfig) as NextConfig & {
  experimental?: Record<string, unknown> & { turbo?: Record<string, unknown> };
  turbopack?: Record<string, unknown>;
};

const { experimental, turbopack, ...restConfig } = rawConfig;
const turboOptions = experimental?.turbo as Record<string, unknown> | undefined;
const remainingExperimental = experimental ? { ...experimental } : undefined;

if (remainingExperimental && "turbo" in remainingExperimental) {
  delete remainingExperimental.turbo;
}

const finalConfig: NextConfig = {
  ...restConfig,
  ...(remainingExperimental && Object.keys(remainingExperimental).length > 0
    ? { experimental: remainingExperimental }
    : {}),
  ...(turbopack ? { turbopack } : {}),
};

if (turboOptions) {
  finalConfig.turbopack = {
    ...(finalConfig.turbopack as Record<string, unknown> | undefined),
    ...turboOptions,
  };
}

export default finalConfig;
