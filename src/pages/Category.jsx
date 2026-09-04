import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../services/supabase";

function Category() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategory() {
      setLoading(true);
      setError("");

      // Get category
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name, slug, description")
        .eq("slug", slug)
        .single();

      if (categoryError) {
        console.error("Error loading category:", categoryError);
        setError("Category not found.");
        setLoading(false);
        return;
      }

      setCategory(categoryData);

      // Get published posts in this category
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          published_at,
          categories (
            name,
            slug
          )
        `)
        .eq("category_id", categoryData.id)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (postsError) {
        console.error("Error loading category posts:", postsError);
        setError("Unable to load articles.");
      } else {
        setPosts(postsData || []);
      }

      setLoading(false);
    }

    fetchCategory();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading category...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold">Category not found</h1>

        <p className="mt-3 text-gray-600">
          The category you're looking for doesn't exist.
        </p>

        <Link
          to="/blog"
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAVBAR */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link to="/" className="text-2xl font-bold">
            Dsquare<span className="text-blue-600">Web</span>
          </Link>

          <div className="hidden gap-8 md:flex">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/blog"
              className="text-gray-600 hover:text-blue-600"
            >
              Blog
            </Link>

            <Link
              to="/about"
              className="text-gray-600 hover:text-blue-600"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="text-gray-600 hover:text-blue-600"
            >
              Contact
            </Link>
          </div>

        </div>
      </nav>

      {/* CATEGORY HEADER */}
      <section className="bg-gray-50 px-6 py-16 text-center">

        <p className="font-semibold text-blue-600">
          CATEGORY
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          {category.name}
        </h1>

        {category.description && (
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            {category.description}
          </p>
        )}

      </section>

      {/* POSTS */}
      <main className="mx-auto max-w-7xl px-6 py-16">

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">

            <h2 className="text-2xl font-bold">
              No articles in this category yet
            </h2>

            <p className="mt-3 text-gray-600">
              Check back soon for new articles.
            </p>

          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {posts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* IMAGE */}
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gray-100">
                    <span className="font-semibold text-gray-400">
                      Dsquare Web
                    </span>
                  </div>
                )}

                <div className="p-6">

                  {/* TITLE */}
                  <h2 className="text-xl font-bold leading-snug">
                    {post.title}
                  </h2>

                  {/* EXCERPT */}
                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-gray-600">
                      {post.excerpt}
                    </p>
                  )}

                  {/* DATE */}
                  {post.published_at && (
                    <p className="mt-4 text-sm text-gray-400">
                      {new Date(post.published_at).toLocaleDateString(
                        "en-NG",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  )}

                  {/* READ MORE */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-5 inline-block font-semibold text-blue-600 hover:underline"
                  >
                    Read article →
                  </Link>

                </div>

              </article>
            ))}

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-gray-50 px-6 py-10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">

          <p className="text-sm text-gray-500">
            © 2026 Dsquare Web. All rights reserved.
          </p>

          <div className="flex gap-5 text-sm">

            <Link
              to="/privacy"
              className="text-gray-600 hover:text-blue-600"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="text-gray-600 hover:text-blue-600"
            >
              Terms
            </Link>

            <Link
              to="/disclaimer"
              className="text-gray-600 hover:text-blue-600"
            >
              Disclaimer
            </Link>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Category;

