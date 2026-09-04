import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function Editor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const postId = searchParams.get("id");
  const isEditing = Boolean(postId);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const [categories, setCategories] = useState([]);

  const [mode, setMode] = useState("compose");

  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEditing);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Category error:", error);
        setError("Unable to load categories.");
      } else {
        setCategories(data || []);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!postId) return;

    async function fetchPost() {
      setLoadingPost(true);

      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          slug,
          content,
          excerpt,
          category_id,
          featured_image,
          seo_title,
          seo_description
        `)
        .eq("id", postId)
        .single();

      if (error) {
        console.error("Post error:", error);
        setError("Unable to load this article.");
      } else if (data) {
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setContent(data.content || "");
        setExcerpt(data.excerpt || "");
        setCategoryId(data.category_id ? String(data.category_id) : "");
        setFeaturedImage(data.featured_image || "");
        setSeoTitle(data.seo_title || "");
        setSeoDescription(data.seo_description || "");
      }

      setLoadingPost(false);
    }

    fetchPost();
  }, [postId]);

  function createSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(e) {
    const value = e.target.value;

    setTitle(value);

    if (!isEditing) {
      setSlug(createSlug(value));
    }

    if (!seoTitle) {
      setSeoTitle(value);
    }
  }

  function updateContentFromEditor() {
    if (!editorRef.current) return;

    setContent(editorRef.current.innerHTML);
  }

  function runCommand(command, value = null) {
    if (!editorRef.current) return;

    editorRef.current.focus();

    document.execCommand(command, false, value);

    updateContentFromEditor();
  }

  function addLink() {
    const url = window.prompt("Enter the URL:");

    if (!url) return;

    runCommand("createLink", url);
  }

  function addImage() {
    const url = window.prompt("Enter the image URL:");

    if (!url) return;

    const alt = window.prompt("Enter image description (alt text):") || "";

    if (!editorRef.current) return;

    editorRef.current.focus();

    document.execCommand(
      "insertHTML",
      false,
      `<img src="${url}" alt="${alt}" style="max-width:100%;height:auto;border-radius:12px;margin:20px 0;" />`
    );

    updateContentFromEditor();
  }

  function formatBlock(value) {
    runCommand("formatBlock", value);
  }

  function switchToCompose() {
    setMode("compose");
  }

  function switchToHTML() {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }

    setMode("html");
  }

  function switchToPreview() {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }

    setMode("preview");
  }

  async function handleSave(status) {
    setLoading(true);
    setMessage("");
    setError("");

    let finalContent = content;

    if (mode === "compose" && editorRef.current) {
      finalContent = editorRef.current.innerHTML;
      setContent(finalContent);
    }

    if (!title.trim()) {
      setError("Please enter an article title.");
      setLoading(false);
      return;
    }

    if (!slug.trim()) {
      setError("Please enter a slug.");
      setLoading(false);
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      setLoading(false);
      return;
    }

    if (!finalContent.trim()) {
      setError("Please write some article content.");
      setLoading(false);
      return;
    }

    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      content: finalContent,
      excerpt: excerpt.trim() || null,
      category_id: Number(categoryId),
      featured_image: featuredImage.trim() || null,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      status,
      published_at:
        status === "published"
          ? new Date().toISOString()
          : null,
    };

    let result;

    if (isEditing) {
      result = await supabase
        .from("posts")
        .update(postData)
        .eq("id", postId);
    } else {
      result = await supabase
        .from("posts")
        .insert(postData);
    }

    if (result.error) {
      console.error("Save error:", result.error);

      if (result.error.code === "23505") {
        setError(
          "That slug is already being used. Please choose another one."
        );
      } else {
        setError(result.error.message);
      }

      setLoading(false);
      return;
    }

    setMessage(
      status === "published"
        ? "Article published successfully!"
        : "Article saved as draft!"
    );

    setLoading(false);

    if (!isEditing) {
      setTimeout(() => {
        navigate("/admin/posts");
      }, 1000);
    }
  }

  if (loadingPost) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading article...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/admin"
            className="text-2xl font-bold"
          >
            Dsquare<span className="text-blue-600">Web</span>
          </Link>

          <Link
            to="/admin/posts"
            className="text-sm font-semibold text-gray-600 hover:text-blue-600"
          >
            ← Articles
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="font-semibold text-blue-600">
            ADMIN PANEL
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            {isEditing ? "Edit Article" : "New Article"}
          </h1>

          <p className="mt-2 text-gray-600">
            Write, format, preview, and publish your article.
          </p>
        </div>

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

        <div className="space-y-6">
          {/* TITLE */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold">
              Article Title
            </label>

            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter article title..."
              className="w-full rounded-xl border border-gray-300 px-5 py-4 text-xl font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </section>

          {/* SLUG */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold">
              URL Slug
            </label>

            <input
              type="text"
              value={slug}
              onChange={(e) =>
                setSlug(createSlug(e.target.value))
              }
              placeholder="article-url-slug"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-sm text-gray-500">
              Your article URL:
              {" "}
              /blog/{slug || "article-url-slug"}
            </p>
          </section>

          {/* EXCERPT */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold">
              Excerpt
            </label>

            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows="3"
              placeholder="Short description of the article..."
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </section>

          {/* EDITOR */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <label className="mb-3 block text-sm font-semibold">
                Article Content
              </label>

              {/* TABS */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={switchToCompose}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    mode === "compose"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Compose
                </button>

                <button
                  type="button"
                  onClick={switchToHTML}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    mode === "html"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  &lt;/&gt; HTML
                </button>

                <button
                  type="button"
                  onClick={switchToPreview}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    mode === "preview"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  👁 Preview
                </button>
              </div>
            </div>

            {/* COMPOSE */}
            {mode === "compose" && (
              <>
                <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-3">
                  <button
                    type="button"
                    onClick={() => runCommand("bold")}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 font-bold hover:bg-gray-100"
                  >
                    B
                  </button>

                  <button
                    type="button"
                    onClick={() => runCommand("italic")}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 italic hover:bg-gray-100"
                  >
                    I
                  </button>

                  <button
                    type="button"
                    onClick={() => runCommand("underline")}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 underline hover:bg-gray-100"
                  >
                    U
                  </button>

                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        formatBlock(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    defaultValue=""
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="" disabled>
                      Heading
                    </option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="p">Paragraph</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => runCommand("insertUnorderedList")}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-100"
                  >
                    • List
                  </button>

                  <button
                    type="button"
                    onClick={() => runCommand("insertOrderedList")}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-100"
                  >
                    1. List
                  </button>

                  <button
                    type="button"
                    onClick={addLink}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-100"
                  >
                    🔗 Link
                  </button>

                  <button
                    type="button"
                    onClick={addImage}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-100"
                  >
                    🖼 Image
                  </button>

                  <button
                    type="button"
                    onClick={() => runCommand("formatBlock", "blockquote")}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-100"
                  >
                    ❝ Quote
                  </button>

                  <button
                    type="button"
                    onClick={() => runCommand("undo")}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-100"
                  >
                    ↶
                  </button>

                  <button
                    type="button"
                    onClick={() => runCommand("redo")}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-100"
                  >
                    ↷
                  </button>
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={updateContentFromEditor}
                  dangerouslySetInnerHTML={{ __html: content }}
                  className="min-h-[450px] w-full p-6 text-base leading-8 outline-none focus:bg-white"
                  data-placeholder="Start writing your article..."
                />
              </>
            )}

            {/* HTML */}
            {mode === "html" && (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="24"
                spellCheck="false"
                className="w-full resize-y p-6 font-mono text-sm leading-7 outline-none"
                placeholder="<h2>Your heading</h2><p>Your article...</p>"
              />
            )}

            {/* PREVIEW */}
            {mode === "preview" && (
              <article
                className="prose prose-lg max-w-none p-8"
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            )}
          </section>

          {/* FEATURED IMAGE */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold">
              Featured Image URL
            </label>

            <input
              type="url"
              value={featuredImage}
              onChange={(e) =>
                setFeaturedImage(e.target.value)
              }
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            {featuredImage && (
              <img
                src={featuredImage}
                alt="Featured preview"
                className="mt-4 max-h-64 w-full rounded-xl object-cover"
              />
            )}
          </section>

          {/* CATEGORY */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Select a category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </section>

          {/* SEO */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              SEO Settings
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  SEO Title
                </label>

                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) =>
                    setSeoTitle(e.target.value)
                  }
                  placeholder="SEO title..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  SEO Description
                </label>

                <textarea
                  value={seoDescription}
                  onChange={(e) =>
                    setSeoDescription(e.target.value)
                  }
                  rows="4"
                  placeholder="SEO description..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* ACTIONS */}
          <section className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={loading}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish Article"}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Editor;

