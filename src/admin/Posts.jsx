import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchPosts() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
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
      .order("created_at", { ascending: false });

    console.log("Posts returned:", data);
    console.log("Posts error:", error);

    if (error) {
      console.error("Error loading posts:", error);
      setError(error.message);
      setPosts([]);
    } else {
      setPosts(data || []);
    }

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
          <p className="font-semibold text-blue-600">ADMIN PANEL</p>
          <h1 className="mt-1 text-3xl font-bold">Articles</h1>
          <p className="mt-2 text-gray-600">
            Manage your blog articles.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">Loading articles...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              Error loading articles
            </p>
            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-bold">No articles yet</h2>
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

        {!loading && !error && posts.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Article
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Category
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
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
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
                        {post.categories?.name || "Uncategorized"}
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
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-3">
                          {post.status === "published" && (
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
                            onClick={() => handleDelete(post.id)}
                            className="text-sm font-semibold text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
