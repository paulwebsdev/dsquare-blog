import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError("");

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
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error loading posts:", error);
        setError("Unable to load blog posts.");
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    }

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* HEADER */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl text-center">

          <p className="font-semibold uppercase tracking-wider text-blue-600">
            Dsquare Web Blog
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
            Learn. Build. Grow.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Practical articles about websites, web development, AI,
            technology, freelancing, and building online.
          </p>

          <div className="mx-auto mt-8 flex justify-center">
            <SearchBar />
          </div>

        </div>
      </section>

      {/* POSTS */}
      <main className="mx-auto max-w-7xl px-6 py-16">

        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">

            <h2 className="text-2xl font-bold text-gray-950">
              No articles yet
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-gray-600">
              We're preparing useful articles for you. Check back soon.
            </p>

          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Latest
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-950">
                All Articles
              </h2>

              <p className="mt-3 text-gray-600">
                Explore our latest practical guides and insights.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          </>
        )}

      </main>

    </div>
  );
}

export default Blog;

