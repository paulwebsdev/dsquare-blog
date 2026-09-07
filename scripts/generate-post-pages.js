import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const env = loadEnv("production", root, "");

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const BASE_URL = "https://blog.dsquareweb.name.ng";
const distDir = path.join(root, "dist");
const baseHtmlPath = path.join(distDir, "index.html");

if (!fs.existsSync(baseHtmlPath)) {
  throw new Error("dist/index.html was not found. Run vite build first.");
}

const baseHtml = fs.readFileSync(baseHtmlPath, "utf8");

const { data: posts, error } = await supabase
  .from("posts")
  .select(
    "title, slug, excerpt, featured_image, published_at, updated_at, seo_title, seo_description, author_name"
  )
  .eq("status", "published");

if (error) {
  throw new Error(
    `Failed to load posts: ${error.message}`
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function removeTag(html, regex) {
  return html.replace(regex, "");
}

for (const post of posts || []) {
  if (!post.slug) continue;

  const url = `${BASE_URL}/blog/${post.slug}`;

  const title =
    post.seo_title ||
    `${post.title} | Dsquare Web Blog`;

  const description =
    post.seo_description ||
    post.excerpt ||
    "Read practical articles from Dsquare Web Blog.";

  const image = post.featured_image || "";

  let html = baseHtml;

  // Remove homepage SEO metadata before adding article metadata.
  html = removeTag(
    html,
    /<title>[\s\S]*?<\/title>/gi
  );

  html = removeTag(
    html,
    /<meta\s+name=["']description["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+name=["']author["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+name=["']robots["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<link\s+rel=["']canonical["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+property=["']og:type["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+property=["']og:title["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+property=["']og:description["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+property=["']og:url["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+property=["']og:site_name["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+property=["']og:image["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+name=["']twitter:card["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+name=["']twitter:title["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+name=["']twitter:description["'][^>]*>/gi
  );

  html = removeTag(
    html,
    /<meta\s+name=["']twitter:image["'][^>]*>/gi
  );

  // Add article-specific metadata.
  const metadata = `
    <title>${escapeHtml(title)}</title>

    <meta
      name="description"
      content="${escapeHtml(description)}"
    />

    <meta
      property="og:type"
      content="article"
    />

    <meta
      property="og:title"
      content="${escapeHtml(title)}"
    />

    <meta
      property="og:description"
      content="${escapeHtml(description)}"
    />

    <meta
      property="og:url"
      content="${escapeHtml(url)}"
    />

    <meta
      property="og:site_name"
      content="Dsquare Web Blog"
    />

    ${
      image
        ? `
    <meta
      property="og:image"
      content="${escapeHtml(image)}"
    />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="755" />
    <meta property="og:image:height" content="755" />
    `
        : ""
    }

    <meta
      name="twitter:card"
      content="summary_large_image"
    />

    <meta
      name="twitter:title"
      content="${escapeHtml(title)}"
    />

    <meta
      name="twitter:description"
      content="${escapeHtml(description)}"
    />

    ${
      image
        ? `
    <meta
      name="twitter:image"
      content="${escapeHtml(image)}"
    />
    `
        : ""
    }

    <link
      rel="canonical"
      href="${escapeHtml(url)}"
    />
`;

  html = html.replace(
    "</head>",
    `${metadata}
  </head>`
  );

  const outputDir = path.join(
    distDir,
    "blog",
    post.slug
  );

  fs.mkdirSync(
    outputDir,
    { recursive: true }
  );

  fs.writeFileSync(
    path.join(outputDir, "index.html"),
    html,
    "utf8"
  );

  console.log(
    `Generated: ${url}`
  );
}

console.log(
  `Generated ${posts?.length || 0} article page(s).`
);



