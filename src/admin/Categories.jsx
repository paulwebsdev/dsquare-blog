import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function Categories() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function createSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function fetchCategories() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, created_at")
      .order("name", { ascending: true });

    if (error) {
      console.error("Category error:", error);
      setError(error.message);
      setCategories([]);
    } else {
      setCategories(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function handleNameChange(e) {
    const value = e.target.value;

    setName(value);

    if (!editingId) {
      setSlug(createSlug(value));
    }
  }

  function resetForm() {
    setName("");
    setSlug("");
    setDescription("");
    setEditingId(null);
    setError("");
    setMessage("");
  }

  function startEdit(category) {
    setEditingId(category.id);
    setName(category.name || "");
    setSlug(category.slug || "");
    setDescription(category.description || "");
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Please enter a category name.");
      setSaving(false);
      return;
    }

    if (!slug.trim()) {
      setError("Please enter a category slug.");
      setSaving(false);
      return;
    }

    const categoryData = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
    };

    let result;

    if (editingId) {
      result = await supabase
        .from("categories")
        .update(categoryData)
        .eq("id", editingId);
    } else {
      result = await supabase
        .from("categories")
        .insert(categoryData);
    }

    if (result.error) {
      console.error("Category save error:", result.error);

      if (result.error.code === "23505") {
        setError(
          "That category name or slug already exists."
        );
      } else {
        setError(result.error.message);
      }

      setSaving(false);
      return;
    }

    setMessage(
      editingId
        ? "Category updated successfully!"
        : "Category created successfully!"
    );

    resetForm();
    await fetchCategories();

    setSaving(false);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Category delete error:", error);

      setError(
        "Unable to delete this category. It may be connected to existing articles."
      );

      return;
    }

    setMessage("Category deleted successfully!");

    await fetchCategories();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/admin"
            className="text-2xl font-bold"
          >
            Dsquare<span className="text-blue-600">Web</span>
          </Link>

          <Link
            to="/admin"
            className="text-sm font-semibold text-gray-600 hover:text-blue-600"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <p className="font-semibold text-blue-600">
            ADMIN PANEL
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Categories
          </h1>

          <p className="mt-2 text-gray-600">
            Create and manage your blog categories.
          </p>
        </div>

        {/* MESSAGES */}
        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="font-medium text-green-700">
              {message}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* FORM */}
          <section className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              {editingId
                ? "Edit Category"
                : "Add Category"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingId
                ? "Update this category."
                : "Create a new category for your blog."}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Web Development"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Slug
                </label>

                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(createSlug(e.target.value))
                  }
                  placeholder="web-development"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Example: /category/web-development
                </p>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows="4"
                  placeholder="A short description of this category..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Category"
                    : "Add Category"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* CATEGORY LIST */}
          <section>
            {loading ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-500">
                  Loading categories...
                </p>
              </div>
            ) : categories.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <h2 className="text-xl font-bold">
                  No categories yet
                </h2>

                <p className="mt-2 text-gray-500">
                  Create your first category using the form.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                      <div>
                        <h3 className="text-lg font-bold">
                          {category.name}
                        </h3>

                        <p className="mt-1 text-sm text-blue-600">
                          /category/{category.slug}
                        </p>

                        {category.description && (
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                            {category.description}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            startEdit(category)
                          }
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(category.id)
                          }
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Categories;

