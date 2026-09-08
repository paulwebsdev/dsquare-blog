import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function Dashboard() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [totalViews, setTotalViews] = useState(0);
  const [viewStats, setViewStats] = useState({});
  const [sourceStats, setSourceStats] = useState({});

  const [loading, setLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setAnalyticsError("");

      const [
        { data: postsData, error: postsError },
        { data: categoriesData, error: categoriesError },
        { count: subscribersCount, error: subscribersError },
        { data: viewsData, error: viewsError },
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

        supabase
          .from("post_views")
          .select("post_id, source, viewed_at"),
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

      if (viewsError) {
        console.error("Analytics error:", viewsError);
        setAnalyticsError(
          "Unable to load view analytics right now."
        );
      }

      setPosts(postsData || []);
      setCategories(categoriesData || []);
      setSubscriberCount(subscribersCount || 0);

      // Calculate analytics
      const postStats = {};
      const trafficStats = {};

      for (const view of viewsData || []) {
        const postId = view.post_id;
        const source = view.source || "other";

        if (!postStats[postId]) {
          postStats[postId] = 0;
        }

        postStats[postId] += 1;

        if (!trafficStats[source]) {
          trafficStats[source] = 0;
        }

        trafficStats[source] += 1;
      }

      setViewStats(postStats);
      setSourceStats(trafficStats);
      setTotalViews((viewsData || []).length);

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

  const mostViewedPosts = [...publishedPosts]
    .sort(
      (a, b) =>
        (viewStats[b.id] || 0) -
        (viewStats[a.id] || 0)
    )
    .slice(0, 5);

  const topArticle = mostViewedPosts[0];

  const topSourceEntry = Object.entries(sourceStats)
    .sort((a, b) => b[1] - a[1])[0];

  const topSource = topSourceEntry
    ? formatSource(topSourceEntry[0])
    : "No views yet";

  function formatSource(source) {
    const names = {
      google: "Google",
      facebook: "Facebook",
      instagram: "Instagram",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      x: "X",
      direct: "Direct",
      other: "Other",
    };

    return names[source] || source;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* TOP NAVBAR */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-2xl font-bold">
            Dsquare
            <span className="text-blue-600">Web</span>
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
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {/* TOTAL ARTICLES */}
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
              {loading
                ? "—"
                : publishedPosts.length}
            </p>
          </div>

          {/* DRAFTS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Drafts
            </p>

            <p className="mt-3 text-3xl font-bold text-orange-500">
              {loading
                ? "—"
                : draftPosts.length}
            </p>
          </div>

          {/* CATEGORIES */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Categories
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-600">
              {loading
                ? "—"
                : categories.length}
            </p>
          </div>

          {/* TOTAL VIEWS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Views
            </p>

            <p className="mt-3 text-3xl font-bold text-purple-600">
              {loading
                ? "—"
                : totalViews.toLocaleString()}
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
              {loading
                ? "—"
                : subscriberCount}
            </p>

            <p className="mt-2 text-xs font-semibold text-purple-600">
              View subscribers →
            </p>
          </Link>
        </section>

        {/* ANALYTICS */}
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="font-semibold text-blue-600">
                ANALYTICS
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Blog Performance
              </h2>

              <p className="mt-2 text-gray-600">
                See which articles are attracting visitors
                and where they are coming from.
              </p>
            </div>
          </div>

          {analyticsError && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">
                {analyticsError}
              </p>
            </div>
          )}

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {/* TOP ARTICLE */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Most Viewed Article
              </p>

              {loading ? (
                <div className="mt-4 space-y-2">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                </div>
              ) : topArticle ? (
                <>
                  <h3 className="mt-4 font-bold text-gray-950">
                    {topArticle.title}
                  </h3>

                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {(viewStats[topArticle.id] || 0).toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    views
                  </p>
                </>
              ) : (
                <p className="mt-4 text-gray-500">
                  No article views yet.
                </p>
              )}
            </div>

            {/* TOP SOURCE */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Top Traffic Source
              </p>

              <p className="mt-4 text-3xl font-bold text-green-600">
                {loading ? "—" : topSource}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {loading || !topSourceEntry
                  ? "No traffic data yet."
                  : `${topSourceEntry[1].toLocaleString()} views`}
              </p>
            </div>

            {/* SOURCE TOTALS */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Traffic Sources
              </p>

              {loading ? (
                <div className="mt-4 space-y-3">
                  <div className="h-4 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 animate-pulse rounded bg-gray-100" />
                </div>
              ) : Object.keys(sourceStats).length === 0 ? (
                <p className="mt-4 text-gray-500">
                  No traffic data yet.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {Object.entries(sourceStats)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([source, count]) => (
                      <div
                        key={source}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600">
                          {formatSource(source)}
                        </span>

                        <span className="text-sm font-bold text-gray-900">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* MOST VIEWED */}
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-5">
              <h3 className="text-lg font-bold">
                Most Viewed Articles
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your top five articles by recorded views.
              </p>
            </div>

            {loading ? (
              <div className="p-6 text-center text-gray-500">
                Loading analytics...
              </div>
            ) : mostViewedPosts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No published articles yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {mostViewedPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">
                          {post.title}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {post.created_at
                            ? new Date(
                                post.created_at
                              ).toLocaleDateString(
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
                    </div>

                    <div className="flex items-center gap-4 md:shrink-0">
                      <div className="text-left md:text-right">
                        <p className="text-xl font-bold text-purple-600">
                          {(viewStats[post.id] || 0).toLocaleString()}
                        </p>

                        <p className="text-xs text-gray-500">
                          views
                        </p>
                      </div>

                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                          ? new Date(
                              post.created_at
                            ).toLocaleDateString(
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