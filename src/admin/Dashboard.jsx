import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function Dashboard() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      const [
        { data: postsData, error: postsError },
        { data: categoriesData, error: categoriesError },
        { count: subscribersCount, error: subscribersError },
      ] = await Promise.all([
        supabase
          .from("posts")
          .select("id, title, status, published_at, created_at")
          .order("created_at", { ascending: false }),

        supabase
          .from("categories")
          .select("id, name"),

        supabase
          .from("newsletter_subscribers")
          .select("*", { count: "exact", head: true }),
      ]);

      if (postsError) {
        console.error("Posts error:", postsError);
      }

      if (categoriesError) {
        console.error("Categories error:", categoriesError);
      }

      if (subscribersError) {
        console.error("Subscribers error:", subscribersError);
      }

      setPosts(postsData || []);
      setCategories(categoriesData || []);
      setSubscriberCount(subscribersCount || 0);

      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  const publishedPosts = posts.filter(
    (post) => post.status === "published"
  );

  const draftPosts = posts.filter(
    (post) => post.status === "draft"
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* TOP NAVBAR */}
      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link to="/" className="text-2xl font-bold">
            Dsquare<span className="text-blue-600">Web</span>
          </Link>

          <div className="flex items-center gap-4">

            <Link
              to="/"
              className="hidden text-sm font-medium text-gray-600 hover:text-blue-600 md:block"
            >
              View Website
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <p className="font-semibold text-blue-600">
              ADMIN PANEL
            </p>

            <h1 className="mt-1 text-3xl font-bold md:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your Dsquare Web Blog from one place.
            </p>
          </div>

          <Link
            to="/admin/editor"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + New Article
          </Link>

        </div>

        {/* STATS */}
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          {/* TOTAL */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Total Articles
            </p>

            <p className="mt-3 text-3xl font-bold">
              {loading ? "—" : posts.length}
            </p>

          </div>

          {/* PUBLISHED */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Published
            </p>

            <p className="mt-3 text-3xl font-bold text-green-600">
              {loading ? "—" : publishedPosts.length}
            </p>

          </div>

          {/* DRAFTS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Drafts
            </p>

            <p className="mt-3 text-3xl font-bold text-orange-500">
              {loading ? "—" : draftPosts.length}
            </p>

          </div>

          {/* CATEGORIES */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Categories
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-600">
              {loading ? "—" : categories.length}
            </p>

          </div>

          {/* NEWSLETTER */}
          <Link
            to="/admin/newsletter"
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <p className="text-sm font-medium text-gray-500">
              Newsletter Subscribers
            </p>

            <p className="mt-3 text-3xl font-bold text-purple-600">
              {loading ? "—" : subscriberCount}
            </p>

            <p className="mt-2 text-xs font-semibold text-purple-600">
              View subscribers →
            </p>

          </Link>

        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-10">

          <h2 className="text-xl font-bold">
            Quick Actions
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {/* CREATE ARTICLE */}
            <Link
              to="/admin/editor"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-bold">
                Create Article
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Write and publish a new blog article.
              </p>

              <span className="mt-4 inline-block font-semibold text-blue-600">
                Start writing →
              </span>
            </Link>

            {/* MANAGE ARTICLES */}
            <Link
              to="/admin/posts"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-bold">
                Manage Articles
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                View, edit, publish, or delete articles.
              </p>

              <span className="mt-4 inline-block font-semibold text-blue-600">
                Manage posts →
              </span>
            </Link>

            {/* MANAGE CATEGORIES */}
            <Link
              to="/admin/categories"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-bold">
                Manage Categories
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Create and organize your blog categories.
              </p>

              <span className="mt-4 inline-block font-semibold text-blue-600">
                Manage categories →
              </span>
            </Link>

            {/* NEWSLETTER */}
            <Link
              to="/admin/newsletter"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-bold">
                Newsletter Subscribers
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                View and manage people subscribed to your newsletter.
              </p>

              <span className="mt-4 inline-block font-semibold text-blue-600">
                View subscribers →
              </span>
            </Link>

          </div>

        </section>

        {/* RECENT POSTS */}
        <section className="mt-10">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold">
              Recent Articles
            </h2>

            <Link
              to="/admin/posts"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View all
            </Link>

          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading articles...
              </div>
            ) : posts.length === 0 ? (
              <div className="p-8 text-center">

                <p className="text-gray-500">
                  No articles yet.
                </p>

                <Link
                  to="/admin/editor"
                  className="mt-3 inline-block font-semibold text-blue-600 hover:underline"
                >
                  Create your first article →
                </Link>

              </div>
            ) : (
              <div className="divide-y divide-gray-200">

                {posts.slice(0, 5).map((post) => (

                  <div
                    key={post.id}
                    className="flex flex-col justify-between gap-3 p-5 md:flex-row md:items-center"
                  >

                    <div>

                      <h3 className="font-semibold">
                        {post.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString(
                              "en-NG",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : ""}
                      </p>

                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {post.status}
                    </span>

                  </div>

                ))}

              </div>
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
