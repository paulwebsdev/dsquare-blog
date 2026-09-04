import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

import FeaturedPost from "../components/FeaturedPost";
import PostCard from "../components/PostCard";
import CategoryCard from "../components/CategoryCard";
import Newsletter from "../components/Newsletter";

function Home() {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHomeData() {
      setLoading(true);
      setError("");

      const [postsResult, categoriesResult] = await Promise.all([
        supabase
          .from("posts")
          .select(`
            id,
            title,
            slug,
            excerpt,
            featured_image,
            published_at,
            categories (
              id,
              name,
              slug
            )
          `)
          .eq("status", "published")
          .order("published_at", { ascending: false }),

        supabase
          .from("categories")
          .select("id, name, slug, description")
          .order("created_at", { ascending: true }),
      ]);

      if (postsResult.error) {
        console.error("Home posts error:", postsResult.error);
        setError("Unable to load articles right now.");
      }

      if (categoriesResult.error) {
        console.error("Home categories error:", categoriesResult.error);
        setError("Unable to load categories right now.");
      }

      const posts = postsResult.data || [];
      const categoryData = categoriesResult.data || [];

      setFeaturedPost(posts[0] || null);
      setLatestPosts(posts.slice(1, 4));
      setCategories(categoryData);

      setLoading(false);
    }

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="font-semibold uppercase tracking-wider text-blue-600">
              Dsquare Web Blog
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-6xl">
              Learn. Build. Grow.
              <span className="block text-blue-600">
                With Technology.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Discover practical guides about websites, web development,
              AI, technology, freelancing, and building online businesses.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/blog"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Articles
              </Link>

              <Link
                to="/about"
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition hover:bg-white"
              >
                About Dsquare Web
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <p className="font-semibold uppercase tracking-wider text-blue-600">
            Featured
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-950">
            Start Here
          </h2>
        </div>

        {loading ? (
          <div className="h-80 animate-pulse rounded-3xl bg-gray-100" />
        ) : featuredPost ? (
          <FeaturedPost post={featuredPost} />
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
            <p className="text-gray-500">
              No published articles yet.
            </p>
          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10">
            <p className="font-semibold uppercase tracking-wider text-blue-600">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-950">
              Explore Our Topics
            </h2>

            <p className="mt-3 text-gray-600">
              Find useful content based on what you want to learn.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No categories available.
            </p>
          )}
        </div>
      </section>

      {/* LATEST ARTICLES */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold uppercase tracking-wider text-blue-600">
              From the Blog
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-950">
              Latest Articles
            </h2>

            <p className="mt-3 text-gray-600">
              Fresh guides and ideas from Dsquare Web.
            </p>
          </div>

          <Link
            to="/blog"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            View all articles →
          </Link>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-2xl bg-gray-100"
                />
              ))}
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
              <p className="text-gray-500">
                More articles will appear here as they are published.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <Newsletter />
      </section>

      {/* ERROR */}
      {error && (
        <div className="mx-auto max-w-7xl px-6 pb-10">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;

