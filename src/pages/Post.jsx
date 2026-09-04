import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../services/supabase";
import RelatedPosts from "../components/RelatedPosts";

function Post() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch article
  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError("");
      setPost(null);

      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          slug,
          content,
          excerpt,
          featured_image,
          published_at,
          updated_at,
          category_id,
          seo_title,
          seo_description,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) {
        console.error("Post error:", error);
        setError("Unable to load this article.");
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Article not found.");
        setLoading(false);
        return;
      }

      setPost(data);
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  // SEO metadata
  useEffect(() => {
    if (!post) return;

    const title =
      post.seo_title ||
      `${post.title} | Dsquare Web Blog`;

    const description =
      post.seo_description ||
      post.excerpt ||
      "Explore practical guides on web development, online business, making money, AI, and technology from Dsquare Web.";

    const canonicalUrl =
      `https://blog.dsquareweb.name.ng/blog/${post.slug}`;

    const imageUrl = post.featured_image || "";

    // Page title
    document.title = title;

    // Helper: meta name
    function setMetaName(name, content) {
      let meta = document.querySelector(
        `meta[name="${name}"]`
      );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    }

    // Helper: meta property
    function setMetaProperty(property, content) {
      let meta = document.querySelector(
        `meta[property="${property}"]`
      );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    }

    // Meta description
    setMetaName("description", description);

    // Canonical URL
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalUrl);

    // Open Graph
    setMetaProperty("og:type", "article");
    setMetaProperty("og:title", title);
    setMetaProperty("og:description", description);
    setMetaProperty("og:url", canonicalUrl);
    setMetaProperty("og:site_name", "Dsquare Web Blog");

    // Twitter / X
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", title);
    setMetaName("twitter:description", description);

    // Featured image for social sharing
    if (imageUrl) {
      setMetaProperty("og:image", imageUrl);
      setMetaName("twitter:image", imageUrl);
    }

    // Article structured data
    const oldSchema = document.getElementById(
      "article-schema"
    );

    if (oldSchema) {
      oldSchema.remove();
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: description,
      url: canonicalUrl,

      author: {
        "@type": "Organization",
        name: "Dsquare Web",
        url: "https://blog.dsquareweb.name.ng",
      },

      publisher: {
        "@type": "Organization",
        name: "Dsquare Web",
        url: "https://blog.dsquareweb.name.ng",
      },
    };

    if (post.published_at) {
      schema.datePublished = post.published_at;
    }

    if (post.updated_at) {
      schema.dateModified = post.updated_at;
    }

    if (imageUrl) {
      schema.image = imageUrl;
    }

    const schemaScript = document.createElement("script");

    schemaScript.id = "article-schema";
    schemaScript.type = "application/ld+json";
    schemaScript.textContent = JSON.stringify(schema);

    document.head.appendChild(schemaScript);

    // Cleanup when leaving the article
    return () => {
      const currentSchema =
        document.getElementById("article-schema");

      if (currentSchema) {
        currentSchema.remove();
      }
    };
  }, [post]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-100" />

          <div className="mt-6 h-5 w-1/3 animate-pulse rounded bg-gray-100" />

          <div className="mt-10 h-80 animate-pulse rounded-2xl bg-gray-100" />

          <div className="mt-10 space-y-4">
            <div className="h-5 animate-pulse rounded bg-gray-100" />
            <div className="h-5 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  // Error / not found
  if (error || !post) {
    return (
      <div className="min-h-screen bg-white px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Dsquare Web Blog
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-950">
            {error || "Article not found."}
          </h1>

          <p className="mt-4 text-gray-600">
            The article you're looking for may have been removed
            or the link may be incorrect.
          </p>

          <Link
            to="/blog"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="min-h-screen bg-white text-gray-900">
      {/* ARTICLE HEADER */}
      <header className="bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <Link
            to="/blog"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Blog
          </Link>

          {post.categories?.name && (
            <Link
              to={`/category/${post.categories.slug}`}
              className="mt-8 block w-fit text-sm font-bold uppercase tracking-wider text-blue-600"
            >
              {post.categories.name}
            </Link>
          )}

          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 text-lg leading-8 text-gray-600">
              {post.excerpt}
            </p>
          )}

          <div className="mt-6 text-sm text-gray-500">
            Published {formattedDate}
          </div>
        </div>
      </header>

      {/* FEATURED IMAGE */}
      {post.featured_image && (
        <div className="mx-auto max-w-5xl px-6 pt-10">
          <img
            src={post.featured_image}
            alt={post.title}
            className="max-h-[600px] w-full rounded-3xl object-cover shadow-sm"
          />
        </div>
      )}

      {/* ARTICLE CONTENT */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-bold
            prose-headings:text-gray-950
            prose-p:leading-8
            prose-p:text-gray-700
            prose-a:text-blue-600
            prose-a:no-underline
            hover:prose-a:underline
            prose-img:rounded-2xl
            prose-img:shadow-sm
            prose-blockquote:border-blue-600
            prose-blockquote:text-gray-600"
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />

        {/* RELATED ARTICLES */}
        <RelatedPosts
          categoryId={post.category_id}
          currentPostId={post.id}
        />
      </div>
    </article>
  );
}

export default Post;