import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../services/supabase";
import RelatedPosts from "../components/RelatedPosts";

function Post() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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

  async function handleNativeShare() {
    if (!post) return;

    const shareUrl =
      `${window.location.origin}/blog/${post.slug}`;

    if (!navigator.share) {
      await handleCopyLink();
      return;
    }

    try {
      await navigator.share({
        title: post.title,
        text:
          post.excerpt ||
          "Read this article on Dsquare Web Blog.",
        url: shareUrl,
      });
    } catch (error) {
      // User cancelled the native share menu.
      if (error?.name !== "AbortError") {
        console.error("Share error:", error);
      }
    }
  }

  async function handleCopyLink() {
    if (!post) return;

    const shareUrl =
      `${window.location.origin}/blog/${post.slug}`;

    try {
      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy link error:", error);
      alert("Unable to copy the link.");
    }
  }

  function getShareUrl(platform) {
    if (!post) return "#";

    const shareUrl = encodeURIComponent(
      `${window.location.origin}/blog/${post.slug}`
    );

    const shareTitle = encodeURIComponent(post.title);

    switch (platform) {
      case "whatsapp":
        return `https://wa.me/?text=${shareTitle}%20${shareUrl}`;

      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;

      case "x":
        return `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`;

      case "telegram":
        return `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`;

      default:
        return "#";
    }
  }

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

  const shareUrl =
    `${window.location.origin}/blog/${post.slug}`;

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

        {/* SHARE ARTICLE */}
        <div className="mt-14 border-t border-gray-200 pt-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-950">
                Share this article
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Found this useful? Share it with someone who might
                find it helpful.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={getShareUrl("whatsapp")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                WhatsApp
              </a>

              <a
                href={getShareUrl("facebook")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Facebook
              </a>

              <a
                href={getShareUrl("x")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                X
              </a>

              <a
                href={getShareUrl("telegram")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                Telegram
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                {copied ? "Copied ✓" : "Copy Link"}
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Share
              </button>
            </div>
          </div>

          <p className="mt-5 break-all text-xs text-gray-400">
            {shareUrl}
          </p>
        </div>

        {/* WEBSITE CTA */}
<div className="mt-14 rounded-3xl bg-gray-950 px-6 py-10 text-center text-white md:px-10">
  <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
    Need a Website?
  </p>

  <h2 className="mt-3 text-2xl font-bold md:text-3xl">
    Ready to take your business online?
  </h2>

  <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
    Want a professional website for your business?
    Dsquare Web can help you create a modern,
    mobile-friendly website built around your business.
  </p>

  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
    <a
      href={`https://wa.me/2348055178547?text=${encodeURIComponent(
        `Hi Dsquare Web 👋, I read your article "${post.title}" and I'm interested in creating a website for my business. I'd like to know more about your services.`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
    >
      💬 Message Us
    </a>

    <Link
      to="/contact"
      className="rounded-xl border border-gray-700 px-6 py-3 font-semibold text-white transition hover:bg-gray-900"
    >
      💻 Create My Website
    </Link>
  </div>
</div>

        {/* SUBSCRIBE CTA */}
<div className="mt-12 rounded-3xl border border-blue-100 bg-blue-50 px-6 py-8 text-center">
  <div className="mx-auto max-w-2xl">
    <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
      Stay Updated
    </p>

    <h2 className="mt-2 text-2xl font-bold text-gray-950">
      Enjoyed this article?
    </h2>

    <p className="mt-3 leading-7 text-gray-600">
      Subscribe to Dsquare Web Blog and get new articles, useful
      tips, AI updates, business ideas, and technology content
      delivered to your inbox.
    </p>

    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("open-newsletter-popup")
        );
      }}
      className="mt-6 inline-flex animate-pulse items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:scale-105 hover:bg-blue-700"
    >
      🔔 Subscribe
    </button>
  </div>
</div>

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
