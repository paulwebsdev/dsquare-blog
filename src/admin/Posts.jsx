import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [viewStats, setViewStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchPosts() {
    setLoading(true);
    setError("");

    const [postsResult, viewsResult] = await Promise.all([
      supabase
        .from("posts")
        .select(`
          id,
          title,
          slug,
          status,
          published_at,
          created_at,
          categories (
            name,
            slug
          )
        `)
        .order("created_at", { ascending: false }),

      supabase
        .from("post_views")
        .select("post_id, source, viewed_at"),
    ]);

    const { data: postsData, error: postsError } = postsResult;
    const { data: viewsData, error: viewsError } = viewsResult;

    console.log("Posts returned:", postsData);
    console.log("Posts error:", postsError);
    console.log("Views returned:", viewsData);
    console.log("Views error:", viewsError);

    if (postsError) {
      console.error("Error loading posts:", postsError);
      setError(postsError.message);
      setPosts([]);
      setLoading(false);
      return;
    }

    if (viewsError) {
      console.error("Error loading view statistics:", viewsError);
      setError(
        `Articles loaded, but view statistics could not be loaded: ${viewsError.message}`
      );
      setPosts(postsData || []);
      setViewStats({});
      setLoading(false);
      return;
    }

    const stats = {};

    for (const view of viewsData || []) {
      const postId = view.post_id;

      if (!stats[postId]) {
        stats[postId] = {
          total: 0,
          sources: {},
        };
      }

      stats[postId].total += 1;

      const source = view.source || "other";

      stats[postId].sources[source] =
        (stats[postId].sources[source] || 0) + 1;
    }

    setPosts(postsData || []);
    setViewStats(stats);
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      alert(error.message);
      return;
    }

    fetchPosts();
  }

  function getTopSource(postId) {
    const stats = viewStats[postId];

    if (!stats || stats.total === 0) {
      return "No views yet";
    }

    const entries = Object.entries(stats.sources);

    if (entries.length === 0) {
      return "Unknown";
    }

    entries.sort((a, b) => b[1] - a[1]);

    return `${formatSource(entries[0][0])}`;
  }

  function formatSource(source) {
    if (!source) return "Unknown";

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

  function getSourceBreakdown(postId) {
    const stats = viewStats[postId];

    if (!stats || stats.total === 0) {
      return "No views yet";
    }

    return Object.entries(stats.sources)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([source, count]) =>
          `${formatSource(source)}: ${count}`
      )
      .join(" • ");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/admin" className="text-2xl font-bold">
            Dsquare<span className="text-blue-600">Web</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="text-sm font-semibold text-gray-600 hover:text-blue-600"
            >
              ← Dashboard
            </Link>

            <Link
              to="/admin/editor"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + New Article
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="font-semibold text-blue-600">
            ADMIN PANEL
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Articles
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your blog articles and monitor their views.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              Loading articles...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              Error loading analytics
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          posts.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <h2 className="text-xl font-bold">
                No articles yet
              </h2>

              <p className="mt-2 text-gray-500">
                Create your first article to see it here.
              </p>

              <Link
                to="/admin/editor"
                className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Create Article
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          posts.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Article
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Views
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Top Source
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Date
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {posts.map((post) => {
                      const stats = viewStats[post.id];
                      const totalViews = stats?.total || 0;

                      return (
                        <tr
                          key={post.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-5">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {post.title}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                /blog/{post.slug}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-600">
                            {post.categories?.name ||
                              "Uncategorized"}
                          </td>

                          <td className="px-6 py-5">
                            <div>
                              <p className="font-bold text-gray-900">
                                {totalViews.toLocaleString()}
                              </p>

                              <p
                                className="mt-1 max-w-xs text-xs text-gray-400"
                                title={getSourceBreakdown(
                                  post.id
                                )}
                              >
                                {getSourceBreakdown(
                                  post.id
                                )}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm font-semibold text-gray-700">
                            {getTopSource(post.id)}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                post.status === "published"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {post.status}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-600">
                            {new Date(
                              post.created_at
                            ).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-3">
                              {post.status ===
                                "published" && (
                                <Link
                                  to={`/blog/${post.slug}`}
                                  className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                >
                                  View
                                </Link>
                              )}

                              <Link
                                to={`/admin/editor?id=${post.id}`}
                                className="text-sm font-semibold text-gray-700 hover:text-blue-600"
                              >
                                Edit
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(post.id)
                                }
                                className="text-sm font-semibold text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}

export default Posts;