import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../services/supabase";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchInput(query);

    if (!query.trim()) {
      setPosts([]);
      return;
    }

    async function searchPosts() {
      setLoading(true);
      setError("");

      const searchTerm = `%${query.trim()}%`;

      const { data, error } = await supabase
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
        .eq("status", "published")
        .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Search error:", error);
        setError("Unable to search articles.");
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    }

    searchPosts();
  }, [query]);

  function handleSearch(e) {
    e.preventDefault();

    const value = searchInput.trim();

    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
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

      {/* HEADER */}
      <section className="bg-gray-50 px-6 py-16">

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold text-blue-600">
            SEARCH DSQUARE WEB
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Find an article
          </h1>

          <p className="mt-4 text-gray-600">
            Search our articles about websites, development, AI,
            technology, freelancing, and more.
          </p>

          {/* SEARCH FORM */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-2xl gap-3"
          >

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 rounded-xl border border-gray-300 px-5 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>

          </form>

        </div>

      </section>

      {/* RESULTS */}
      <main className="mx-auto max-w-7xl px-6 py-16">

        {!query && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              Enter a search term to find articles.
            </p>
          </div>
        )}

        {query && loading && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              Searching articles...
            </p>
          </div>
        )}

        {query && !loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {query && !loading && !error && posts.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">

            <h2 className="text-2xl font-bold">
              No articles found
            </h2>

            <p className="mt-3 text-gray-600">
              We couldn't find any published articles matching "{query}".
            </p>

          </div>
        )}

        {query && !loading && !error && posts.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Search results for "{query}"
              </h2>

              <p className="mt-1 text-gray-500">
                {posts.length} article{posts.length !== 1 ? "s" : ""} found
              </p>
            </div>

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

                    {/* CATEGORY */}
                    {post.categories && (
                      <Link
                        to={`/category/${post.categories.slug}`}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        {post.categories.name}
                      </Link>
                    )}

                    <h3 className="mt-3 text-xl font-bold leading-snug">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 text-gray-600">
                        {post.excerpt}
                      </p>
                    )}

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
          </>
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

export default Search;

