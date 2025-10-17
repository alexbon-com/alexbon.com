#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_LOCALE = "ua";
const LOCALES = ["ua", "ru", "en"];

const here = fileURLToPath(new URL(".", import.meta.url));
const root = join(here, "..");
const legacyDir = join(root, "legacy");

function ensureLeadingSlash(pathname) {
  if (!pathname) {
    return "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

async function ensureDir(path) {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
    return;
  }
  // mkdir with recursive will not throw if dir exists, but calling it avoids extra stat on some FS.
  await mkdir(path, { recursive: true });
}

const postsPath = new URL("../.velite/posts.json", import.meta.url);
const postsRaw = await readFile(postsPath, "utf8");
const posts = JSON.parse(postsRaw);
if (!Array.isArray(posts)) {
  console.error("❌ Unable to load posts from .velite/index.js. Make sure Velite has been built.");
  process.exit(1);
}

const groups = new Map();
for (const post of posts) {
  const bucket = groups.get(post.translationGroup) ?? new Map();
  bucket.set(post.locale, post);
  groups.set(post.translationGroup, bucket);
}

await rm(legacyDir, { recursive: true, force: true });
await ensureDir(legacyDir);

const items = [];

for (const post of posts) {
  const targetDir = join(legacyDir, post.locale, post.collection);
  await ensureDir(targetDir);

  const fileName = `${post.slug}.md`;
  const targetFile = join(targetDir, fileName);

  const fragments = [];
  const title = typeof post.title === "string" ? post.title.trim() : "";
  if (title) {
    fragments.push(`# ${title}`);
  }
  const body = typeof post.raw === "string" ? post.raw.trim() : "";
  if (body) {
    fragments.push(body);
  }
  const legacyContent = `${fragments.join("\n\n")}\n`;
  await writeFile(targetFile, legacyContent, "utf8");

  const translationSet = groups.get(post.translationGroup) ?? new Map();
  const translations = [];
  for (const [locale, variant] of translationSet) {
    if (locale === post.locale && variant.slug === post.slug) {
      continue;
    }
    translations.push({
      locale,
      slug: variant.slug,
      url: ensureLeadingSlash(variant.url),
      canonical: variant.canonical,
    });
  }

  translations.sort((a, b) => {
    const indexA = LOCALES.indexOf(a.locale);
    const indexB = LOCALES.indexOf(b.locale);
    const rankA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const rankB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return a.locale.localeCompare(b.locale);
  });

  items.push({
    title,
    slug: post.slug,
    locale: post.locale,
    collection: post.collection,
    type: post.type,
    url: ensureLeadingSlash(post.url),
    canonical: post.canonical,
    translationGroup: post.translationGroup,
    translations,
    tags: post.tags,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt ?? post.publishedAt,
    description: post.description,
    cardSnippet: post.cardSnippet ?? null,
    author: post.author,
    license: post.license,
    plainText: post.plainText,
    archiveUrl: post.archived,
    rawUrl: post.rawUrl,
    sourcePath: post.sourcePath,
    legacyPath: relative(legacyDir, targetFile).replace(/\\/g, "/"),
    jsonLd: post.jsonLd,
  });
}

items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

const indexPayload = {
  archived: true,
  generatedAt: new Date().toISOString(),
  defaultLocale: DEFAULT_LOCALE,
  totalItems: items.length,
  items,
};

const indexPath = join(legacyDir, "index.json");
await writeFile(indexPath, `${JSON.stringify(indexPayload, null, 2)}\n`, "utf8");

console.log(`✅ Legacy archive exported to ${relative(root, legacyDir)}/`);
