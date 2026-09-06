import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const env = loadEnv("production", root, "");

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = "https://blog.dsquareweb.name.ng";

const staticRoutes = [
  "/",
  "/blog",
  "/about",
  "/contact",
  "/search",
  "/privacy",
  "/terms",
  "/disclaimer",
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toISOString().split("T")[0];
}

const urls = staticRoutes.map((route) => ({
  loc: `${BASE_URL}${route}`,
}));

// Get public categories
const { data: categories, error: categoriesError } = await supabase
  .from("categories")
  .select("slug");

if (categoriesError) {
  throw new Error(
    `Failed to load categories: ${categoriesError.message}`
  );
}

for (const category of categories || []) {
  if (category.slug) {
    urls.push({
      loc: `${BASE_URL}/category/${encodeURIComponent(category.slug)}`,
    });
  }
}

// Get published posts only
const { data: posts, error: postsError } = await supabase
  .from("posts")
  .select("slug, published_at, updated_at, created_at")
  .eq("status", "published")
  .order("published_at", { ascending: false });

if (postsError) {
  throw new Error(
    `Failed to load published posts: ${postsError.message}`
  );
}

for (const post of posts || []) {
  if (!post.slug) continue;

  urls.push({
    loc: `${BASE_URL}/blog/${encodeURIComponent(post.slug)}`,
    lastmod: formatDate(
      post.updated_at || post.published_at || post.created_at
    ),
  });
}

const xmlUrls = urls
  .map(({ loc, lastmod }) => {
    const lastmodTag = lastmod
      ? `\n    <lastmod>${lastmod}</lastmod>`
      : "";

    return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmodTag}
  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>
`;

const publicDir = path.join(root, "public");
const sitemapPath = path.join(publicDir, "sitemap.xml");

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(sitemapPath, sitemap, "utf8");

console.log(
  `Sitemap generated successfully with ${urls.length} URLs.`
);
console.log(`Saved to: ${sitemapPath}`);
